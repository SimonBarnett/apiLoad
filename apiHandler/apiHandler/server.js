PORT = 8080;
HOST = '0.0.0.0';

fs = require('fs'),
url = require('url'),
http = require('http'),
util = require('./util');

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

    handler(req, res);

}).listen(PORT, HOST);

var post = [];
console.log(JSON.stringify(post, null, 2)); 