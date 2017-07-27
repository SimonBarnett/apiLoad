apiResult = require('./apiResult');

class baseob {
    get log() {
        return this.root().apiResult;
    }
    set log(val) {
        this.root().apiResult = val;
    }
    root() {
        var p = this
        while (p.parent !== undefined) {
            p = p.parent
        }
        return p;
    }
}

class Row extends baseob {
    constructor(parent, line) {
        super();
        this.line = line.$LN;
        this.parent = parent;        
        this.columns = [];
        this.subLoadings = [];
        this.read(line);
        this.loaded = "N";

    }

    sucsess() {
        this.loaded = "Y";
    }

    fail(e) {
        this.log.addError(this.line, e.message);
        this.log.setError(400, "Not all lines were loaded.")
    }

    read(Object) {
        for (var key in Object) {
            switch (typeof Object[key]) {
                case "object":
                    this.subLoadings.push(new Loading(this, Object[key], key));
                    break;

                default:
                    if (key.slice(0, 1) !== "$"){
                        var i = {};
                        i.name = key;
                        i.value = Object[key];
                        i.parent = this.parent;
                        this.columns.push(i);
                    }
                    break;
            }
        }
    }

    value() {
        var ret = {};
        for (var i=0; i < this.columns.length; i++) {
            ret[this.columns[i].name] = this.columns[i].value;
        }
        return ret;
    }
}

class Loading extends baseob {
    constructor(parent, Object, name) {
        super();
        this.rows = [];

        if (parent == undefined) {
            this.name = this.fn(Object);
            this.apiResult = new apiResult;

            for (var k = 0; k < Object[this.name].length; k++) {
                this.rows.push(new Row(this, Object[this.name][k]))
            }

        } else {
            this.parent = parent;
            this.name = name;
            for (var k = 0; k < Object.length; k++) {            
                this.rows.push(new Row(this, Object[k]))
            }
        }
    }

    fn(Object) {
        for (var key in Object) { return key }
    }
}

module.exports = Loading;