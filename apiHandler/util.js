var
    Loading = require('./Loading'),
    apiResult = require('./apiResult'),
    priCredential = require('./priCredential'),
    priCN = require('./priCN'),
    settings = require('./settings.json');

    parse = function (cn, requestBody, res) {
        var
            iter = function (ar, fn, result) {
                return new Promise((resolve, reject) => {
                    try {
                        var cntr = 0;
                        function next() {
                            if (cntr < ar.length) {
                                ar[cntr].$index = cntr;
                                fn(ar[cntr], result).then(curform => {
                                    cntr++;
                                    next();
                                }).catch(err => reject(err));
                            } else { resolve(result) };
                        };
                        next();
                    } catch (err) { reject(err) }
                })
            },

            iterForm = function (m, cn) {
                return new Promise((resolve, reject) => {
                    cn.openForm(m.name);
                    iter(m.rows, iterRow, cn).then(cn => {
                        cn.closeForm();
                        resolve(cn);
                    }).catch(err => { m.log.setError(null, null, err); reject(err) })
                })
            },

            iterRow = function (m, cn) {
                return new Promise((resolve, reject) => {
                    cn.editOrInsert(m.value()).then(result => {
                        m.sucsess(result);
                        iter(m.subLoadings, iterForm, cn).then(cn => {
                            cn.lastEntity.clearSelection();
                            resolve(cn);
                        }).catch(err => reject(err))

                    }).catch(err => {
                        m.fail(err);
                        resolve(cn);
                    })
                })
            };

        try {
            var m = new Loading(null, JSON.parse(requestBody));
            iterForm(m, cn).then(() => {
                res.simpleJSON(200, m.log.toJSON);

            }).catch(er => {
                console.log(er);
                res.simpleJSON(200, m.log.toJSON);

            });
        }
        catch (e) {
            var result = {};
            result.apiResponse = {};
            result.apiResponse.response = "400";
            result.apiResponse.message = "Invalid data.";
            res.simpleJSON(400, result);
        }

    };

util = exports;

util.getMap = [];

util.get = function (path, handler) {
    util.getMap[path] = handler;
};

util.not_found = function (co, req, res) {
    var not_found_msg = 'Invalid Priority Company.';

    res.writeHead(404, {
        'Content-Type': 'text/plain',
        'Content-Length': not_found_msg.length
    });
    res.end(not_found_msg);
};


util.get("/", function (co, req, res) {
    var not_found_msg = 'Invalid Priority Company.';

    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Length': not_found_msg.length
    });
    res.end(not_found_msg);
});

for (var i = 0, len = settings.env.length; i < len; i++) {    
    util.get("/" + settings.env[i], function (co, req, res) {

        var requestBody = '';
        req.on('data', function (data) {
            requestBody += data;
        });
        req.on('end', function () {
            parse(
                new priCN(
                    settings.url,
                    co,
                    new priCredential(
                        settings.user,
                        settings.pass
                    )
                ),
                requestBody,
                res
            )
        });

    });
};


