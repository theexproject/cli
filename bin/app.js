#! /usr/bin/env node
const figlet = require('figlet');
const pkg = require('../package.json');
const os = require("os");
const fs = require("fs");
const { exec } = require("child_process")
var configdir = require("path").join(process.cwd() + "/.scripty/");
const path = require('path');
const program = require('commander');
const { join } = require('path');
program.version(pkg.version)

class app {

    /**
     * 
     * @param {Array} args 
     */

    constructor(args) {
        this.args = args;
        if(!fs.existsSync(join(configdir, "scripts.json"))) {
            this.configurate().then(() => {
                this.config = require(join(configdir +  'scripts.json'))
            })
        } else {
            this.config = require(join(configdir +  'scripts.json'))
        }
    }

    async start() {
        console.log(figlet.textSync("exscript", "Big Money-ne"));
        console.log(`\n\nversion: ${pkg.version}`);
        process.on("beforeExit", () => {
            fs.writeFile(join(configdir, "scripts.json"), JSON.stringify(require("./templates/scripts.json"), null, 4), () => {
                this.config = require(join(configdir +  'scripts.json'))
            })
        })
        program.command("run <name>").description("run a script").action((name) => {
            if(!name) return;
            console.log(`running`, name)
            if (this.config.scripts[name]) {
                var x = this.config.scripts[name]
                this.sh(x.run.command).then((put) => {
                    if (put.stderr != '') {
                        console.log(stderr)
                        process.exit()
                    } else {
                        console.log(put.stdout)
                        process.exit()
                    }
                })
            } else {
                console.log("Not Found")
                process.exit()
            }
        })

        program.command("this.config").option("-e, --explorer", "open in explorer").description("opens this.config").action((opts) => {
            if (!opts.explorer) {
                this.sh(`notepad ${path.join(this.configdir, "scripts.json")}`).then(console.log("done"))
            } else {
                this.sh(`explorer ${path.join(this.configdir)}`).then(console.log("done"))
            }
        })

        program.command("reload").description("reload this.config").action(() => {
            this.configurate().then(() => {
                process.exit();
            })
        })

        program.parse(this.args);
    }

    async configurate() {
        try {
            this.config = require(join(configdir +  'scripts.json'))
        } catch (e) {
            fs.writeFile(join(configdir, "scripts.json"), JSON.stringify(require("./templates/scripts.json"), null, 4), () => {
                this.config = require(join(configdir +  'scripts.json'))
            })
        }
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