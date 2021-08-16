// basically "make" but s u s
module.exports = function(file) {
    const cwd = process.cwd();
    const fs = require('fs');
    const vm = require('vm');
    const {execSync} = require('child_process');
    const internalModules = {}
    const context = { 
        exec(data) {
            process.stdout.write(execSync(data));
        },
        args: process.argv,
        smake: {
            getModule(name) {
                if (internalModules.hasOwnProperty(name)) return internalModules[name];
                return require(name);
            },
            patch(file,line_index,newline,encoding = "utf-8") {
                if (!fs.existsSync(file)) throw `[patch] ${file} doesn't exist!`;
                const lines = fs.readFileSync(file,{encoding}).split('\n');
                lines[line_index] = newline;
                fs.writeFileSync(file,lines.join('\n'),{encoding});
                return true;
            }
        }
     };
     vm.createContext(context);

    if (!fs.existsSync(file)) return console.log('could not find: '+file);
    const fileq = fs.readFileSync(file,{encoding: 'utf-8'});
    vm.runInContext(fileq, context);
}

