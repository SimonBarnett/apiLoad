class priCredential {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    authorization(){
        return "Basic " + new Buffer(this.username + ":" + this.password).toString("base64")
    }
}
module.exports = priCredential;