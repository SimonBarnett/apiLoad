class apiError {
    constructor(line, message) {
        this.line = line;
        this.message = message;
    }
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
        for (var i in this.msgs) {
            var m = {};
            m.line = this.msgs[i].line || "0";
            m.message = this.msgs[i].message;
            result.apiResponse.msgs.push(m);
        }
        return result;
    }

    addError(line, message) {
        this.msgs.push(new apiError(line, message));
    }

    setError(response, message, e) {
        console.log(e.message);
        this.response = response || 500;
        this.message = message || "API error."
        this.addError(null, e.message)
    }

}

module.exports = apiResult;