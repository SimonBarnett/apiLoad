<h1>Summary.</h1>
This solution contains a <a href="https://github.com/SimonBarnett/apiLoad/tree/master/apiHandler">NodeJS Windows service</a> which performs Priority Loadings and a <a href="https://github.com/SimonBarnett/apiLoad/tree/master/apiLoad">.net client</a> which generates the <a href="https://github.com/SimonBarnett/apiLoad/blob/master/clientExample/output.json">JSON data</a> that is sent to the service.

<br><br>This service is required to process oData requests from the <a href="https://github.com/SimonBarnett/api">IIS API</a>.

<br><a href="https://app.getpostman.com/run-collection/4594feb31a8a5b1aa40c" target="_blank"><img src="https://run.pstmn.io/button.svg" alt="Run in Postman"></a>

<h1>Solution Projects.</h1>
<h2><a href="https://github.com/SimonBarnett/apiLoad/tree/master/apiHandler">API Handler</a></h2>
A NodeJS service that uses oData to create Priority Loadings.

<h2><a href="https://github.com/SimonBarnett/apiLoad/tree/master/apiLoad">.Net API Load Library</a></h2>
A dotNet DLL to create the JSON message which is sent to the API Handler, and parse the result.

<h2><a href="https://github.com/SimonBarnett/apiLoad/tree/master/clientExample">.Net Client Example</a></h2>
An example usage of the API Load Library.