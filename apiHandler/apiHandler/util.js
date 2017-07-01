var
    priority = require('priority-web-sdk'),
    qs = require('querystring'),
    url = require('url'),
    FS = require("fs"),
    myForm;

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

    req.on('data', function (data) {
        requestBody += data;
    });

    req.on('end', function () {

        try {
            var apiResponse = log();
            var js = JSON.parse(requestBody);

            //console.log(JSON.stringify(js, null, 2)); 

            priority.login(config).then(function () {
                for (var key in js) {
                    console.log("Open form %s.", key);
                    priority.formStart(key, showMessage, updateFields).then(
                        function (form) {
                            myForm = form;
                            for (var i in js[key]) {
                                parseArray(js[key][i])
                            }
                            res.simpleJSON(200, { apiResponse });
                        }
                    );
                };                
            });

        } catch (e) {
            apiResponse.response = 500;
            apiResponse.message = "API error."
            apiResponse.msgs.push(apiError(null, e.message));

            res.simpleJSON(200, { apiResponse });
        }

    });

});

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

function parseArray(node) {
    return new Promise((resolve, reject) => {
        for (var key in node) {
            switch (typeof node[key]) {
                case "string":
                    console.log("%s : %s", key, node[key]);
                    if (key.slice(0, 1) != "$") {
                        myForm.fieldUpdate(
                            key,
                            node[key],
                            function () {

                            },
                            function () {

                            }
                        );
                    };
                    break;
            };
        };

        myForm.saveRow(
            0,
            function () {

            },
            function () {

            }
        );

        for (var key in node) {
            switch (typeof node[key]) {
                case "object":
                    console.log("Open sub form %s.", key);
                    myForm.startSubForm(
                        key,
                        showMessage,
                        updateFields
                    ).then(function (form) {
                        Myform = form;
                        for (var i in node[key]) {
                            parseArray(node[key][i]).then(function () { }, function (message) { reject(message) });

                        };
                        console.log("Close sub form %s.", key);
                        Myform.endCurrentForm();
                    });
                    break;
            };
        };
        resolve();

    })
};

var showMessage = function (message) {    
    if (message.type != "warning") {        
        console.log("%s", message.message);

    } else {
        message.form.warningConfirm(1);
    }
}

function updateFields(result) {
    if (result[myForm.name]) {
        var fields = result[myForm.name][1];
        for (var fieldName in fields) {
            console.log("Update %s", fieldName)
        }
    }    
}