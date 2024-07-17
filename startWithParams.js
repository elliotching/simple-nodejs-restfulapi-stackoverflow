// const { exec, execSync, spawn } = require("child_process");

// // Get the arguments passed to the script
// // const args = process.argv.slice(2).join(' ');
// const args = process.argv;

// const command = `nodemon server ${args.slice(2).join(" ")}`;
// // const command = `nodemon server`;

// console.log(`command == ${command}`);

// const cmd = exec(command,(a,b,c)=>{
// console.log(b)
// });

// cmd.stdout.on("data", (data) => {
//     console.log(`stdout: ${data}`);
// });

// cmd.stderr.on("data", (data) => {
//     console.error(`stderr: ${data}`);
// });
