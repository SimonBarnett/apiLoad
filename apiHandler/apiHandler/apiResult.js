class apiError {
    constructor(line, loaded) {
        this.line = line;
        this.loaded = loaded;    
    }

    get message() { return this._message };
    set message(value) { this._message = value};

    get resultKeys() { return this._resultKeys };
    set resultKeys(value) { this._resultKeys = value };

}

class apiResult {
    constructor(response, message) {
        this.response = response || "200";
        this.message = message || "Ok.";
        this.msgs = [];
    }

    get toJSON() {
        var result = {};
        result.apiResponse = {};
        result.apiResponse.response = this.response;
        result.apiResponse.message = this.message;
        result.apiResponse.msgs = [];
        for (var i = 0; i < this.msgs.length; i++) {        
            var m = {};
            m.line = this.msgs[i].line;
            m.loaded = this.msgs[i].loaded;
            if (this.msgs[i].message) {
                m.message = this.msgs[i].message;
            }
            if (this.msgs[i].resultKeys) {
                m.resultKeys = this.msgs[i].resultKeys;
            }

            result.apiResponse.msgs.push(m);
        }
        return result;
    }

    addError(line, message) {
        var er = new apiError(line, "N");
        er.message = message;
        this.msgs.push(er);
    }

    addSucsess(line, resultKeys) {
        var er = new apiError(line, "Y");
        er.resultKeys = resultKeys;
        this.msgs.push(er);
    }

    setError(response, message) {
        console.log(message);
        this.response = response || 500;
        this.message = message || "API error."
    }

}

module.exports = apiResult;