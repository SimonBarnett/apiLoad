Loading = require('./Loading');
apiResult = require('./apiResult');

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


util.get('/signature', function (req, res) {

    var requestBody = '';

    req.on('data', function (data) {
        requestBody += data;
    });

    req.on('end', function () {

        var buf = new Buffer(requestBody.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        fs.writeFile('image.png', buf);
        res.simpleJSON(200, {upload: 1})

    });
})

util.get('/', function (req, res) {

    var requestBody = '';
    var msg;
    var curform;

    req.on('data', function (data) {
        requestBody += data;
    });

    req.on('end', function () {

        var ld = new Loading(null, JSON.parse(requestBody));
        Login(ld, curform).then(() => {
            res.simpleJSON(200, ld.log.toJSON)
        }).catch(() => {
            res.simpleJSON(200, ld.log.toJSON)
            })        

    });

    function Login(ld, curform) {
        return new Promise((resolve, reject) => {
            console.log("Connecting...");
            priority.login(config).then(() => {
                console.log("Opening form %s.", ld.name);
                priority.formStart(ld.name, null, null, 1).then(curform => {
                    curform.clearRows().then(() => {
                        iter(ld.rows, iterRow, curform).then(curform => {
                            console.log("Close form %s.", curform.name);
                            curform.endCurrentForm().then(() => {
                                resolve()
                            }).catch(err => { ld.log.setError(null, null, err); reject(err) })
                        }).catch(err => { ld.log.setError(null, null, err); reject(err) })
                    }).catch(err => { ld.log.setError(null, null, err); reject(err) })
                }).catch(err => { ld.log.setError(null, null, err); reject(err) })
            }).catch(err => { ld.log.setError(null, null, err); reject(err) })
        })
    }

    var iterRow = function (m, curform) {
        return new Promise((resolve, reject) => {
             iter(m.columns, iterField, curform).then(curform => {
                console.log("Saving form %s.", curform.name);
                curform.saveRow(0).then(() => {
                    m.sucsess();
                    iter(m.subLoadings, iterForm, curform).then(curform => {  
                        if (m.$index < m.parent.rows.length-1) {
                            console.log("New row in form %s.", curform.name);
                            curform.newRow().then(() => {
                                resolve(curform)
                            }).catch(err => reject(err))
                        } else {
                            resolve(curform)
                        }
                    }).catch(err => reject(err))
                }).catch(err => {
                    m.fail(err);
                    resolve(curform);
                })
            }).catch(err => reject(err))                   
        })
    }

    var iterForm = function (m, curform) {
        return new Promise((resolve, reject) => {  
            console.log("Opening sub form %s.", m.name);
            curform.startSubForm(m.name, null, null).then(curform => {
                curform = curform;
                console.log("New row in form %s.", curform.name);
                curform.newRow().then(() => {
                    iter(m.rows, iterRow, curform).then(curform => {
                        console.log("Closing sub form %s.", curform.name);                        
                        curform.endCurrentForm().then(() => {                                                        
                            resolve(curform);
                        }).catch(err => reject(err))
                    }).catch(err => reject(err))
                }).catch(err => reject(err))
            }).catch(err => reject(err))        
        })
    };

    var iterField = function (m, curform) {
        return new Promise((resolve, reject) => {   
            console.log("Set field %s = %s.", m.name, m.value);
            curform.fieldUpdate(m.name, m.value).then(() => {
                resolve(curform);
            }).catch(err => {
                if (err.message == "Record already exists in form.") {
                    SelectRow(m, curform).then(() => {
                        resolve();
                    }).catch(err => reject(err))
                } else {
                    reject(err)
                }
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
                        fn(ar[cntr], result).then(curform => {
                            cntr++;
                            next();
                        }).catch(err => reject(err));
                    } else {resolve(result)};
                };
                next();        
            } catch (err) { reject(err)}    
        })
    }

});

function SelectRow(m, curform) {
    return new Promise((resolve, reject) => {
        curform.undo().then(() => {
            curform.getRows(1).then(rows => {
                var cntr = 1;
                while (rows[curform.name][cntr] !== undefined) {
                    var f = 1;
                    for (var i in parent.rows[m.$index].columns) {
                        if (rows[cntr][parent.rows[m.$index].columns[i].name] !== parent.rows[m.$index].columns[i].value) {
                            f = 0;
                        }
                    }
                    if (f == 1) {
                        curform.setActiveRow(cntr).then(() => {
                            resolve();
                        })
                    } else { cntr++; }

                }
                resolve();

            }).catch(err => reject(err))
        }).catch(err => reject(err))
    })
}


//var
//    Loading = require('./Loading'),
//    apiResult = require('./apiResult'),
//    m = new Loading(null, require("./json.json")),
//    priCredential = require('./priCredential'),
//    priCN = require('./priCN'),
//    cn = new priCN(
//        "https://erpdemo.emerge-it.co.uk",
//        "demo",
//        new priCredential("apiuser", "123456")
//    ),   

//    iter = function (ar, fn, result) {
//        return new Promise((resolve, reject) => {
//            try {
//                var cntr = 0;
//                function next() {
//                    if (cntr < ar.length) {
//                        ar[cntr].$index = cntr;
//                        fn(ar[cntr], result).then(curform => {
//                            cntr++;
//                            next();
//                        }).catch(err => reject(err));
//                    } else { resolve(result) };
//                };
//                next();
//            } catch (err) { reject(err) }
//        })
//    },

//    iterForm = function (m, cn) {
//        return new Promise((resolve, reject) => {
//            cn.openForm(m.name);
//            iter(m.rows, iterRow, cn).then(cn => {
//                cn.closeForm();
//                resolve(cn);
//            }).catch(err => { m.log.setError(null, null, err); reject(err) })
//        })
//    },

//    iterRow = function (m, cn) {
//        return new Promise((resolve, reject) => {
//            cn.editOrInsert(m.value()).then(result => {
//                m.sucsess();
//                iter(m.subLoadings, iterForm, cn).then(cn => {
//                    resolve(cn);
//                }).catch(err => reject(err))

//            }).catch(err => {
//                m.fail(err);
//                resolve(cn);
//            })
//        })
//    };

//iterForm(m, cn).then(() => {
//    //res.simpleJSON(200, m.log.toJSON)
//}).catch(er => { console.log(er) });





//priCredential = require('./priCredential');
//priCN = require('./priCN');

//var cn = new priCN(
//    "https://erpdemo.emerge-it.co.uk",
//    "demo",
//    new priCredential("apiuser", "123456")
//);

//var customer = {
//    "CUSTNAME": "foo",
//    "CUSTDES": "bar2"
//};

//var person = {
//    "NAME": "Simon Barnett",
//    "FIRM":"Medatech"
//};

//var address = {
//    "ADDRESS": "49, Great Park Drive",
//    "ADDRESS2": "Leyland",
//    "ZIP": "PR25 3UN"

//};

//cn.openForm("CUSTOMERS");
//cn.editOrInsert(customer).then(result => {
//    //console.log("%j", result);

//    cn.openForm("CUSTPERSONNEL");
//    cn.editOrInsert(person).then(result => {
//        //console.log("%j", result);

//        cn.openForm("BILLTO");
//        cn.editOrInsert(address).then(result => {
//            //console.log("%j", result);
//            cn.closeForm();

//        }).catch(er => {console.log(er)});
//    }).catch(er => { console.log(er) });
//}).catch(er => { console.log(er) });

