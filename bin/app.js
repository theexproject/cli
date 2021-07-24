#! /usr/bin/env node
const figlet    = require('figlet');
const pkg       = require('../package.json');
const nconf     = require("nconf");
const path      = require('path');
const program   = require('commander');
const colours   = require("colours");
const Logger    = require('./Logger');

Logger.out = (msg) => {
    return colours.blue(`[out]: `) + msg
};
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
        this.loglogo();
        this.checks();
        Logger.info(`version ${pkg.version}`);
        this.loadCommands();

        program.parse(this.args);
    }

    async loadCommands() {
        program.command("run <script>")
        .description("bruh").option("-a, --arguments")
        .action(async(name, args) => {
            if(!name) return Logger.error(`provide a script name`);
            if (this.config.get(`scripts:${name}`)) {
                var x = this.config.get(`scripts:${name}`)
                Logger.info(`running ${name}`) 
                var cmdBootstrap = await this.sh(x.run);

                cmdBootstrap.stdout.on("data", function (data) {
                    process.stdout.write(Logger.out(data))
                })

                cmdBootstrap.on("close", function () {
                    Logger.success("completed task")
                    process.exit()
                })
        
                process.stdin.on("data", function (data) {
                    cmdBootstrap.stdin.write()
                })
            } else {
                Logger.error(`script not found`);
                process.exit()
            }
        })

        this.loadExtensions()
    }

    async loadExtensions() {
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
    }

    checks() {
        if(this.config.get("version") == pkg.config.beta) {
            Logger.warn("detected beta config this might result in")
            Logger.warn("unexpected errors and results using exscript.")
        } else if(this.config.get("version") != pkg.config.stable) {
            Logger.warn("detected unstable config this might result in")
            Logger.warn("unexpected errors and results using exscript.")
        } else {
            Logger.info("detected and loaded stable config")
        }
    }

    async configurate() {
        nconf.file({ file: './.exs/scripts.json' });
        this.config = nconf

        nconf.defaults({
            "version": pkg.config.stable,
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