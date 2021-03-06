
fs = require('fs'),
url = require('url'),
http = require('http'),
util = require('./util'),

String.prototype.format = String.prototype.f = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; });
};
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {if (this[i] === obj) {return true;}}
    return false;
};

var settings = require('./settings.json');


http.createServer(function (req, res) {
    var handler = util.getMap[url.parse(req.url).pathname] || util.not_found;
    res.simpleJSON = function (code, obj) {
        var body = JSON.stringify(obj);
        res.writeHead(code, {
            'Content-Type': 'text/json',
            'Content-Length': body.length
        });

        res.write(body);
        res.end();

    };

    handler(url.parse(req.url).pathname.slice(1), req, res);

}).listen(settings.port, settings.host);

console.log("Started.");


