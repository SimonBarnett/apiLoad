var
    priority = require('priority-web-sdk'),
    qs = require('querystring'),
    url = require('url'),
    FS = require("fs"),
    
    config = {
        url: 'https://erpdemo.emerge-it.co.uk',
        tabulaini: 'tabula.ini',
        language: 2,
        company: 'demo',
        appname: 'demo',
        username: 'apiuser',
        password: '123456',
        devicename: ''    
    };

util = exports;

util.getMap = [];

util.get = function (path, handler) {
    util.getMap[path] = handler;
};

util.not_found = function (req, res) {
    var not_found_msg = 'Not Found';

    res.writeHead(404, {
        'Content-Type': 'text/plain',
        'Content-Length': not_found_msg.length
    });
    res.end(not_found_msg);
};

util.get('/', function (req, res) {

    var requestBody = '';
    var msg;
    var curform;

    req.on('data', function (data) {
        requestBody += data;
    });

    req.on('end', function () {

        try {
            var apiResponse = log();
            var js = JSON.parse(requestBody);
           
            console.log(JSON.stringify(js, null, 2)); 

            priority.login(config).then(() => {
                var k = FormName(js);
                priority.formStart(k, showMessage, updateFields, 1).then(curform => {
                    curform = curform;
                    iter(js[k], itertop, curform).then(() => {
                        res.simpleJSON(200, { apiResponse });
                    }).catch(err => { throw (err) })
                }).catch(err => { throw (err) })
            });

        } catch (e) {
            apiResponse.response = 500;
            apiResponse.message = "API error."
            apiResponse.msgs.push(apiError(null, e.message));

            res.simpleJSON(200, { apiResponse });
        }

    });

});

function FormName(Object) {
    for (var key in Object) { return key }
}

var itertop = function (m, curform) {
    return new Promise((resolve, reject) => {
        iter(toArray(m), iterForm, curform).then(() => {
            resolve();
        }).catch(err => reject(err))
    })
};

var iterForm = function (m, curform) {
    return new Promise((resolve, reject) => {        
        switch (typeof m.value) {
            case "object":
                curform.saveRow(0).then(() => {
                    curform.startSubForm(m.name, showMessage, updateFields).then(curform => {
                        iter(m.value, iterRow, curform).then(() => {
                            curform.endCurrentForm().then(() => {
                                resolve();
                            }).catch(err => reject(err))
                        }).catch(err => reject(err))
                    }).catch(err => reject(err))
                })
                break;

            default:
                if (m.name.slice(0, 1) != "$") {
                    curform.fieldUpdate(m.name, m.value).then(() => {
                        resolve();
                    }).catch(err => reject(err))
                } else {resolve();}
                break;

        }        
    })
};

var iterRow= function (m, curform) {
    return new Promise((resolve, reject) => {
        iter(toArray(m), iterForm, curform).then(() => {
            resolve();
        })
    })
}

/* Iterate function */
function iter(ar, fn, result) {
    return new Promise((resolve, reject) => {
        try {
            var cntr = 0;
            function next() {
                if (cntr < ar.length) {
                    ar[cntr].$index = cntr;
                    fn(ar[cntr], result).then(() => {
                        cntr++;
                        next();

                    }).catch(err => reject(err));

                } else {
                    resolve(result)

                };
            };
            next();

        } catch (e) {
            reject(e)
        }
    })
}

function toArray(Object) {
    var
        a = [];    
    for (var key in Object) {
        switch (typeof Object[key]) {
            case "object":
                break;

            default:
                var i = {};
                i.name = key;
                i.value = Object[key]
                a.push(i);        
                break;
        }        
    }
    for (var key in Object) {
        switch (typeof Object[key]) {
            case "object":
                var i = {};
                i.name = key;
                i.value = Object[key]
                a.push(i);
                break;

            default:
                break;
        }
    }
    return a;
}

function sortArray(Object) {
    var
        a = []
        cntr = 0;
        while (cntr < Object.length) {
            a.push(toArray(Object[cntr]));
            cntr++
        }
    return a;
}
function log() {
    var l = {};
    l.response = "200";
    l.message = "Ok";
    l.msgs = [];
    return l;
}

function apiError(Line, Message) {
    var e = {};
    e.line = Line;
    e.message = Message;    
    return e;
}

var showMessage = function (message) {    
    if (message.type != "warning") {        
        console.log("%s", message.message);

    } else {
        message.form.warningConfirm(1);
    }
}

function updateFields(result) {
    //if (result[myForm.name]) {
    //    var fields = result[myForm.name][1];
    //    for (var fieldName in fields) {
    //        console.log("Update %s", fieldName)
    //    }
    //}    
}