#!/usr/bin/env node
const yargs = require('yargs/yargs')
const {spawn} = require('child_process');
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv))
.command('java [jarfile]', 'start java', (yargs) => {
  return yargs
    .positional('jarfile', {
      describe: 'The .jar file you want to run'
    })
}, (argv) => {
  console.log(`Running ${argv.jarfile}...`);
  const initialHeapSize = process.env.ihs || "100M";
  if (argv['max-memory']) console.log(`Maximum Memory: ${argv['max-memory']}`);
  const jvm_args = [
      "-jar",
      argv.jarfile,
      "-Xmx",
      argv['max-memory']+"M",
      "-Xms",
      initialHeapSize
     
  ];

  console.log('Starting Java...');
  var proc = spawn('java',jvm_args,{cwd: argv.workdir || undefined, stdio: 'inherit'});
  proc.on('exit',(code) => {
    console.log(`java exited with code: ${code}`);
    process.exit(code);
  })
})
.command('smake [smakefile]','starts smake',(yargs) => {
  return yargs.positional('smakefile',{
    describe: 'The smakefile filename.'
  })
},(argv) => {
  const smake = require('./susmake');
  smake(argv.smakefile);
})
.option('max-memory',{
    type: 'number',
    description: 'Maximum Memory in MB'
})
.option('workdir',{
  alias: 'w',
  type: 'string',
  description: 'Working Directory'
})
.argv