#! /usr/bin/env node
const clear = require('clear');
const app = require('./bin/app');
const App = new app();

(async () => {
    await App.start(process.argv);
})();