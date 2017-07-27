querystring = require('querystring');
priCredential = require('./priCredential');

// Base REST object
class restBase {
    constructor(cn) {
        this.cn = cn;
        this.Data = '';
        this.query = '';
        this.orderby = '';
    }
    get postData() { return this.Data };
    set postData(value) { this.Data = value };

    get filter() { return this.query };
    set filter(value) { this.query = value };

    get sort() { return this.orderby };
    set sort(value) { this.orderby = value };

    queryString() {
        var q = {};
        if (this.query.length > 0) { q.$filter = this.query };
        if (this.orderby.length > 0) { q.$sort = this.orderby };
        return querystring.stringify(q)
    }

    get() {
        return new Promise((resolve, reject) => {
            const lib = (this.cn.secure == 1) ? require('https') : require('http');
            const req = lib.request(
                this.cn.options(this),
                (res) => {
                    res.setEncoding('utf8');

                    const result = [];
                    const resp = res;

                    // handle http errors
                    res.on('data', (chunk) => {
                        result.push(chunk);
                    });

                    res.on('end', (res) => {
                        console.log("Server said [{0}]: {1}".f(resp.statusCode, resp.statusMessage));
                        if (resp.statusCode < 200 || resp.statusCode > 299) {
                            var er = {};
                            er["message"] = "Server said [{0}]...{1}".f(resp.statusCode, resp.statusMessage);
                            reject(er);

                        } else {
                            resolve(JSON.parse(result.join('')));
                        }

                    });

                });

            req.on('error', (e) => {
                reject(e);
            });

            // write data to request body            
            req.write(this.Data);
            req.end();

        });
    }
}

// Extends restBase: GET
class restGet extends restBase {
    constructor(cn) {
        super(cn);
        this.method = "GET";
    }
}
// Extends restBase: PATCH
class restPatch extends restBase {
    constructor(cn) {
        super(cn);
        this.method = "PATCH";
    }
}
// Extends restBase: POST
class restPost extends restBase {
    constructor(cn) {
        super(cn);
        this.method = "POST";
    }
}

/*  Class to hold form information.
    requires ./entity.json containing entity keys 
*/
class entity {
    constructor(name, len) {
        this.name = name;
        this.selected = "";
        if (len != undefined && len > 0) { this.subform = "_SUBFORM" } else { this.subform = "" };
        var ents = require('./entity.json');
        for (var e in ents.entities) {
            if (ents.entities[e].name == name) {
                this.keys = ents.entities[e].keys;
                break;
            }
        }
    }
    get rowData() { return this.row; }

    filter(row) {
        var ret = "";
        for (var k = 0; k < this.keys.length; k++) {
            ret += "{0} eq '{1}'".f(this.keys[k], row[this.keys[k]]);
            if (k < this.keys.length - 1) { ret += " and " }
        }
        return ret;
    }
    select(row) {
        this.row = row;
        var ret = "{0}".f("(");
        if (this.keys) {
            for (var k = 0; k < this.keys.length; k++) {
                var ob = {};
                ob[this.keys[k]] = "'{0}'".f(row[this.keys[k]]);

                ret += querystring.stringify(ob); //"{0}='{1}'".f(this.keys[k], row[this.keys[k]]);
                if (k < this.keys.length - 1) { ret += "," }
            }
        }
        this.selected = "{0}{1}".f(ret, ")");

    }
    url() {
        return "{0}{1}{2}".f(this.name, this.subform, this.selected);
    }
    hasKeys(rowData) {
        if (rowData == undefined) {
            return (this.keys);

        } else {
            var keyCount = 0;
            var foundCount = 0;
            if (this.keys) {
                for (var k = 0; k < this.keys.length; k++) {
                    keyCount++;
                    if (rowData[this.keys[k]]) {
                        foundCount++;
                    }
                }
            }
            if (keyCount == 0 || foundCount == 0) {
                return false;
            }
            if (keyCount == foundCount) {
                return true;
            }
            throw new Error("Not all keys populated.")

        }
    }
    postEdit(rowData) {
        var ret = [];
        for (var k = 0; k < Object.keys(rowData).length; k++) {
            var columnName = Object.keys(rowData)[k];
            // Don't update keys.
            if (!this.keys.contains(columnName)) {
                // Don't update same data.                
                if (this.row[columnName] !== rowData[columnName]) {
                    ret.push("{0}:'{1}'".f(columnName, rowData[columnName]));
                }
            };
        }
        return "{{0}}".f(ret.join(','));
    }
    postInsert(rowData) {
        var ret = [];
        for (var k = 0; k < Object.keys(rowData).length; k++) {
            var columnName = Object.keys(rowData)[k];
            ret.push("{0}:'{1}'".f(columnName, rowData[columnName]));
        }
        return "{{0}}".f(ret.join(','));
    }
}

// Exported Class
class priCN {
    constructor(url, env, credentials, tabulaini) {
        
        this.env = env;
        this.credentials = credentials;
        this.tabulaini = tabulaini || "tabula.ini";
        this.method = '';
        this.entityList = []; // Array of Entity Class

        switch (url.slice(4, 5).toLowerCase()) {
            case 's':
                this.secure = 1;
                this.port = 443;
                this.url = url.slice(8, url.length);
                break;

            default:
                this.secure = 0;
                this.port = 80;
                this.url = url.slice(7, url.length);
                break;
        }
    }

    get lastEntity() { return this.entityList[this.entityList.length-1] };

    currentUrl(request) {
        var url = "/odata/Priority/{0}/{1}".f(this.tabulaini, this.env)
        for (var i = 0; i < this.entityList.length ; i++) {
            url += "/{0}".f(this.entityList[i].url());

        }
        return "{0}?{1}".f(url, request.queryString());
    }
    
    options(request) {
        var reqURL = this.currentUrl(request);
        var ret = {
            hostname: this.url,
            port: this.port,
            path: reqURL,
            method: request.method,
            headers: {
                'User-Agent' : 'Medatech JS oData Client',
                'Content-Type': 'application/json;odata.metadata=minimal',
                'Content-Length': Buffer.byteLength(request.Data),
                'Authorization': this.credentials.authorization()
            }
        }
        console.log("{0} {1}".f(request.method, reqURL));
        console.log(JSON.stringify(request.postData));
        console.log("-------->");
        return ret;
    }
    openForm(name) {
        console.log("Opening form %s.", name);
        this.entityList.push(new entity(name, this.entityList.length));
    }
    closeForm() {
        console.log("Closing form %s.", this.entityList[this.entityList.length - 1].name);
        this.entityList.splice(this.entityList.length -1, 1)
    }

    editOrInsert(rowData) {
        return new Promise((resolve, reject) => {
            if (!this.lastEntity.hasKeys()) {
                this.edit(this.lastEntity.postInsert(rowData)).then(result => {
                    resolve(result);
                }).catch(er => { reject(er) });

            } else {
                if (this.lastEntity.hasKeys(rowData)) {
                    this.exists(rowData).then(ex => {
                        if (ex) {
                            this.edit(this.lastEntity.postEdit(rowData)).then(result => {
                                resolve(result);
                            }).catch(er => { reject(er) });

                        } else {
                            this.insert(this.lastEntity.postInsert(rowData)).then(result => {
                                resolve(result)
                            }).catch(er => { reject(er) });

                        }
                    }).catch(er => { reject(er) });

                } else {
                    this.insert(this.lastEntity.postInsert(rowData)).then(result => {
                        resolve(result)
                    }).catch(er => { reject(er) });

                }

            }
        }
    )}

    insert(postData) {
        return new Promise((resolve, reject) => {
            // New row.
            var g = new restPost(this)
            g.postData = postData;
            g.get().then(result => {
                this.lastEntity.select(result);
                resolve(result);
            }).catch(er => { reject(er) });
        });
    }

    edit(postData) {
        return new Promise((resolve, reject) => {
            if (postData != "{}") {
                var g = new restPatch(this);
                g.postData = postData;
                g.get().then(result => {
                    this.lastEntity.select(result);
                    resolve(result);
                }).catch(er => { reject(er) });

            } else {
                console.log("No edits.");
                resolve(this.lastEntity.rowData);
            }
        });
    }

    exists(rowData) {
        return new Promise((resolve, reject) => {
            var g = new restGet(this);
            g.filter = this.lastEntity.filter(rowData)
            g.get().then(result => {
                if (result.value.length > 0) {
                    this.lastEntity.select(result.value[0]);
                    resolve(true);
                } else {
                    resolve(false);
                };
            }).catch(er => { reject(er) })
        })
    };
    
}

module.exports = priCN;