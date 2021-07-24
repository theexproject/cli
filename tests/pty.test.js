var os = require('os');
var pty = require('node-pty');

var shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';

var ptyProcess = pty.spawn("node.exe", ["tests/cli.test.js"], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env,
  
});

console.log("hi")

ptyProcess.onData((data) => {
  process.stdout.write(data)
}) 

process.stdin.on('data', (data) => {
  ptyProcess.write(data)
})