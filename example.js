var path = require("path");
var sprite = require("./lib/svg-sprite");
var fs  = require("fs");
var vfs  = require("vinyl-fs");

var config = {
    common: "icon",
    dims: true,
    layout: "diagonal",
    render: {
        css: true
    }
};

sprite.createSprite(config,
    function (err, res, template) {
        fs.writeFileSync("test/output/sprite.svg", res);
        fs.writeFileSync("test/output/shane.css", template);
    }
);
