var path   = require("path");
var sprite = require("./lib/svg-sprite");
var fs     = require("fs");
var vfs    = require("vinyl-fs");
var File   = require('vinyl');
var mustache = require('mustache');

var config = {
    common: "icon",
    dims: true,
    layout: "diagonal",
    render: {
        css: true
    }
};

var svgs = sprite.createSprite(config);

function svgSprites() {

    var files = [];
    var tasks = {};
    var counter = 0;

    return require("through2").obj(function (file, enc, cb) {

        svgs.addFile(file.path, file.contents.toString(), counter, tasks);

        counter += 1;
        cb(null);

    }, function (cb) {

        var that = this;

        svgs._processFiles(tasks, function () {


            var svg = svgs.toSVG(false);
            var data = svgs.data;

            that.push(new File({
                cwd:  "./",
                base: "./",
                path: "./svg.svg",
                contents: new Buffer(svg)
            }));

            var css    = mustache.render(fs.readFileSync(path.resolve("tmpl/sprite.css"), 'utf-8'), data);
            var inline = mustache.render(fs.readFileSync(path.resolve("tmpl/sprite.inline.svg"), 'utf-8'), data);

            that.push(new File({
                cwd:  "./",
                base: "./",
                path: "./svg.css",
                contents: new Buffer(css)
            }));

            that.push(new File({
                cwd:  "./",
                base: "./",
                path: "./svg.inline.svg",
                contents: new Buffer(inline)
            }));

            cb(null);
            return true;
        });
    });
}



vfs.src("test/badfiles/*.svg")
    .pipe(svgSprites(config))
    .pipe(vfs.dest("test/output"));
