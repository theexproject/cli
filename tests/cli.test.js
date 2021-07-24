const readline = require("readline");
const rl = readline.createInterface({ 
    input: process.stdin,
    output: process.stdout
});

rl.question("Hi, What's your age? > ", (age)=>{
    console.log(`Your age is ${age}`);
    console.log("less goooo");
    process.exit(0);
});

rl.on("close", () => {

});