#! /usr/bin/env node
const figlet = require('figlet');
const pkg = require('../package.json');
const os = require("os");
var configdir = require("path").join(os.homedir() + "/.scripty");
const path = require('path');
const program = require('commander');

class app {

    /**
     * 
     * @param {Array} args 
     * @param {Command} program 
     */

    constructor(args) {
        this.args = args;
    }

    async start() {
        console.log(figlet.textSync("Scripty", "Big Money-ne"));
        console.log(`\n\nversion: ${pkg.version}`);
        await this.configurate();
        await this.program.parse(this.args);
    }

    async configurate() {
        var config = {
            "version": 1,
            "scripts": {
                "default": {
                    "name": "default",
                    "run": {
                        "type": "default",
                        "command": "echo \"hello\""
                    }
                }
            }
        }

        const fs = require("fs");
        if(!fs.existsSync(configdir)) {
            fs.mkdirSync(configdir, (err) => {
                if(err) {
                    throw err;
                } else {
                    if(!fs.existsSync(path.join(configdir, 'scripts.json'))) {
                        fs.writeFileSync(path.join(configdir, 'scripts.json'), JSON.stringify(config), (err) => {
                            if(err) {
                                throw err;
                            } else {
                                console.log("Saved first Config!")
                            }
                        })
                    }
                }
            })
        } else {
            if(!fs.existsSync(path.join(configdir, 'scripts.json'))) {
                fs.writeFileSync(path.join(configdir, 'scripts.json'), JSON.stringify(config), (err) => {
                    if(err) {
                        throw err;
                    } else {
                        console.log("Saved first Config!")
                    }
                })
            } else {
                fs.readFileSync(path.join(configdir, 'scripts.json'), (err, data) => {
                    if(err) {
                        throw err
                    } else {
                        config = JSON.parse(data)
                    }
                })
            }
        }

    }
}

module.exports = app