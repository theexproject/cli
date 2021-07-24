#! /usr/bin/env node
const figlet    = require('figlet');
const pkg       = require('../package.json');
const os        = require("os");
const fs        = require("fs");
const nconf     = require("nconf");
const path      = require('path');
const program   = require('commander');
const Logger    = require('./Logger');
program.version(pkg.version)

class app {

    /**
     * 
     * @param {Array} args 
     */

    constructor(args) {
        this.args = args;
        this.configurate();

        // Save Configuration
        process.on("beforeExit", () => {
            this.config.save()
        })
    }

    async start() {
        this.loglogo()
        console.log(`version: ${pkg.version}`);

        program.command("run <script>")
            .description("bruh").option("-a, --arguments")
            .action(async(name, args) => {
                if(!name) return Logger.error(`provide a script name`);
                if (this.config.get(`scripts:${name}`)) {
                    var x = this.config.get(`scripts:${name}`)
                    console.log(x)
                    console.log(`running ${name}`) 
                    console.log(`$ ${x.run}`)
                    var cmdBootstrap = await this.sh(x.run);

                    cmdBootstrap.stdout.on("data", function (data) {
                        process.stdout.write(data)
                    })

                    cmdBootstrap.on("close", function () {
                        Logger.success("completed task")
                        process.exit()
                    })
            
                    process.stdin.on("data", function (data) {
                        cmdBootstrap.stdin.write(data)
                    })
                } else {
                    Logger.error(`script not found`);
                    process.exit()
                }
        })

        program.command("config").option("-e, --explorer", "open in explorer").description("opens the config").action((opts) => {
            if (!opts.explorer) {
                this.sh(`notepad ${path.join(this.configdir, "scripts.json")}`).then(console.log("done"))
            } else {
                this.sh(`explorer ${path.join(this.configdir)}`).then(console.log("done"))
            }
        })

        program.command("reload").description("reload config").action(() => {
            this.configurate().then(() => {
                process.exit();
            })
        })

        program.parse(this.args);
    }

    async configurate() {
        nconf.file({ file: './.exs/scripts.json' });
        this.config = nconf

        nconf.defaults({
            "settings": {},
            "scripts": {
                "default": {
                    "type": "default",
                    "run": "echo EXScript, working clean."
                }
            }
        })
    }

    loglogo() {
        if(typeof this.config.get("settings") !== 'undefined') {

            if(typeof this.config.get("settings:noLogLogo") !== 'undefined') {
                return console.log("exscript")
            } 
            if(this.config.get("settings:color") !== 'undefined') {
                switch(this.config.get("settings:color")) {
                    case "red": {           
                        console.log(figlet.textSync("exscript", "Big Money-ne").red);
                    } break;
                    case "green": {
                        console.log(figlet.textSync("exscript", "Big Money-ne").green);
                    } break;
                    case "yellow": {
                        console.log(figlet.textSync("exscript", "Big Money-ne").yellow);
                    } break; 
                    case "blue": {
                        console.log(figlet.textSync("exscript", "Big Money-ne").blue);
                    } break;
                    default: {
                        console.log(figlet.textSync("exscript", "Big Money-ne"));
                    } break;
                }
            } else {
                console.log(figlet.textSync("exscript", "Big Money-ne"));
            }
        }
    }

    async sh(script) {
        var cmd = require("node-cmd");

        var cmdBootstrap = cmd.run(`${script}`, function (err, data, stderr) {});

        return cmdBootstrap;
    }
}

module.exports = app