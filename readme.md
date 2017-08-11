<h1>Summary.</h1>
This solution contains a <a href="https://github.com/SimonBarnett/apiLoad/tree/master/apiHandler">NodeJS Windows service</a> which performs Priority Loadings and a <a href="https://github.com/SimonBarnett/apiLoad/tree/master/apiLoad">.net client</a> which generates the <a href="https://github.com/SimonBarnett/apiLoad/tree/master/clientExample">.Net Client Example</a> to generate the <a href="https://github.com/SimonBarnett/apiLoad/blob/master/clientExample/output.json">JSON data</a> that is sent to the service.


<a href="https://www.getpostman.com/run-collection/29b5ed9ca3ca6f69aee1" target="_blank"><img src="https://run.pstmn.io/button.svg" alt="Run in Postman"></a>

<h1>Solution Projects.</h1>
<h2><a href="https://github.com/SimonBarnett/apiLoad/tree/master/apiHandler">API Handler</a></h2>
A NodeJS service that uses oData to create Priority Loadings.

<h2><a href="https://github.com/SimonBarnett/apiLoad/tree/master/apiLoad">.Net API Load Library</a></h2>
A dotNet DLL to create the JSON message which is sent to the API Handler, and parse the result.

<h2><a href="https://github.com/SimonBarnett/apiLoad/tree/master/clientExample">.Net Client Example</a></h2>
An example usage of the API Load Library.