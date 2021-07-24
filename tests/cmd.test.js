var cmd = require("node-cmd");
console.log(`$ dir\n`)

var cmdBootstrap = cmd.run(`node tests/cli.test.js`, function (err, data, stderr) {});

cmdBootstrap.stdout.on("data", function (data) {
    process.stdout.write(data)
})

process.stdin.on("data", function (data) {
    cmdBootstrap.stdin.write(data)
})