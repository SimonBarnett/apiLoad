var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
    name: 'PriPROC6',
    description: 'Priority Loading Daemon.',
    script: 'C:\\inetpub\\mobile6\\server.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
    console.log('Installed');
    svc.start();

});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall', function () {
    console.log('Uninstall complete.');
    console.log('The service exists: ', svc.exists);

});

svc.install();