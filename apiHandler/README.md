<h1>NodeJS Windows Loading Service</h1>

<h2>Summary.</h2>
The handler service accepts <a href="https://github.com/SimonBarnett/apiLoad/blob/master/clientExample/output.json">JSON data</a> containing Priority form/column/data.

Data received by the service is passed into a <a href="https://github.com/SimonBarnett/apiLoad/blob/master/apiHandler/Loading.js">Loading</a> structure.

The <a href="https://github.com/SimonBarnett/apiLoad/blob/master/apiHandler/util.js">http handler</a> iterates through the Loading structure issuing oData commands using an <a href="https://github.com/SimonBarnett/apiLoad/blob/master/apiHandler/priCN.js">oData Client</a>.

<h2>Installation.</h2>
The handler is installed as a Windows Service using the <a href="https://github.com/SimonBarnett/apiLoad/blob/master/apiHandler/install.js">installation script</a>.