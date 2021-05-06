#! /usr/bin/env node
const figlet = require('figlet');
const pkg = require('../package.json');
const os = require("os");
const { exec } = require("child_process")
var configdir = require("path").join(os.homedir() + "/.scripty");
const path = require('path');
const program = require('commander');
program.version(pkg.version)

class app {

    /**
     * 
     * @param {Array} args 
     */

    constructor(args) {
        this.args = args;
    }

    async start() {
        console.log(figlet.textSync("exscript", "Big Money-ne"));
        console.log(`\n\n\tversion: ${pkg.version}`);
        await this.configurate();
        var config = this.config
        program.option("-r, --run", "run a script", "default").action((name) => {
            if(config.scripts[name.run]) {
                var x = config.scripts[name.run]
                this.sh(x.run.command).then((put) => {
                    if(put.stderr != '') {
                        console.log(stderr) 
                    } else {
                        console.log(put.stdout)
                    }
                })
            }
        })

        program.command("config").option("-e, --explorer", "open in explorer").description("opens config").action((opts) => {
            if(!opts.explorer) {
                this.sh(`notepad ${path.join(configdir, "scripts.json")}`).then(console.log("done"))
            } else {
                this.sh(`explorer ${path.join(configdir)}`).then(console.log("done"))
            }
        })

        program.command("reload").description("reload config").action(() => {
            this.configurate()
        })

        program.parse(this.args);
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
        if (!fs.existsSync(configdir)) {
            fs.mkdirSync(configdir, (err) => {
                if (err) {
                    throw err;
                } else {
                    if (!fs.existsSync(path.join(configdir, 'scripts.json'))) {
                        fs.writeFileSync(path.join(configdir, 'scripts.json'), JSON.stringify(config), (err) => {
                            if (err) {
                                throw err;
                            } else {
                                console.log("Saved first Config!")
                            }
                        })
                    }
                }
            })
        } else {
            if (!fs.existsSync(path.join(configdir, 'scripts.json'))) {
                fs.writeFileSync(path.join(configdir, 'scripts.json'), JSON.stringify(config), (err) => {
                    if (err) {
                        throw err;
                    } else {
                        console.log("Saved first Config!")
                    }
                })
            } else {
                fs.readFileSync(path.join(configdir, 'scripts.json'), (err, data) => {
                    if (err) {
                        throw err
                    } else {
                        config = JSON.parse(data)
                    }
                })
            }
        }
        this.config = config;
    }

    async sh(cmd) {
        return new Promise(function (resolve, reject) {
            exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ stdout, stderr });
                }
            });
        });
    }

}

module.exports = app