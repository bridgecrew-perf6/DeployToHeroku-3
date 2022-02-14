const childProcess = require('child_process');
exports.spawn = function (command, argsarray, envoptions) {
  return new Promise((resolve, reject) => {
    console.log('executing', command, argsarray.join(' '));
    const childProc = childProcess.spawn(command, argsarray, envoptions);
    childProc.stdout.on('data', buffer => console.log(buffer.toString()));
    childProc.stderr.on('data', buffer => console.error(buffer.toString()));
    childProc.on('exit', (code, signal) => {
      console.log(`${command} completed with ${code}:${signal}`);
      if (code || signal) {
        reject(`${command} failed with ${code || signal}`);
      } else {
        resolve();
      }
    });
    childProc.on('error', reject);
  });
};
