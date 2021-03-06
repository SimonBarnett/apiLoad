<h1>NodeJS Windows Loading Service</h1>

<h2>Summary.</h2>
The handler service accepts <a href="https://github.com/SimonBarnett/apiLoad/blob/master/clientExample/output.json">JSON data</a> containing Priority form/column/data.
Data received by the service is passed into a <a href="https://github.com/SimonBarnett/apiLoad/blob/master/apiHandler/Loading.js">Loading</a> structure.
The <a href="https://github.com/SimonBarnett/apiLoad/blob/master/apiHandler/util.js">http handler</a> iterates through the Loading structure issuing oData commands using an <a href="https://github.com/SimonBarnett/apiLoad/blob/master/apiHandler/priCN.js">oData Client</a>.

<br>For each row the <a href="https://github.com/SimonBarnett/apiLoad/blob/master/apiLoad/apiError.vb">response</a> contains either the keys that were created by the loading, or an error message.

<h2>Postman example.</h2>
This Postman example sends data to the demo server at erpdemo.emerge-it.co.uk.

<br><a href="https://www.getpostman.com/run-collection/29b5ed9ca3ca6f69aee1" target="_blank"><img src="https://run.pstmn.io/button.svg" alt="Run in Postman"></a>

<h2>Installation.</h2>
The handler is installed as a Windows Service using the <a href="https://github.com/SimonBarnett/apiLoad/blob/master/apiHandler/install.js">installation script</a>.

```
node C:\inetpub\mobile6\install.js
```

<h2>Configuration.</h2>
The <a href="https://github.com/SimonBarnett/apiLoad/blob/master/apiHandler/server.js">server</a> can be set to listen on 0.0.0.0 to allow external connections, or on 127.0.0.1, to only accept requests from the local machine.<br><br>

The <a href="https://github.com/SimonBarnett/apiLoad/blob/master/apiHandler/priCN.js">oData Client</a> requires the <a href="https://github.com/SimonBarnett/apiLoad/blob/master/apiHandler/entity.json">entity.json file</a>, containing the list of keys for entities used by loadings.

The <a href="https://github.com/SimonBarnett/apiLoad/blob/master/apiHandler/util.js">util.js</a> needs a handler for each Priority company that accepts data, like so:

```JavaScript
util.get('/demo2', function (req, res) {

    var requestBody = '';
    req.on('data', function (data) {
        requestBody += data;
    });
    req.on('end', function () {
        parse(
            new priCN(url, "demo2", credential),
            requestBody,
            res
        )
    });

});

```