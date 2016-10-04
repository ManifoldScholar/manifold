import runAll from 'npm-run-all';

if (__DEVELOPMENT__) {
  // We need to clean our builds first, and then build the shared vendor DLL.
  const runList = [
    "clean-builds",
    "build-universal-dll"
  ];
  runAll(runList, { parallel: false, stdout: process.stdout })
    .then(() => {
      // Once those are built, we can build server code and start servers. The universal
      // library we're using will wait to start the srevers until the server code exists,
      // which is why these can be run in parallel.
      const parallelRunList = [
        "build-server-react",
        "build-server-web",
        "server-react",
        "server-assets",
        "server-web"
      ];
      runAll(parallelRunList, { parallel: true, stdout: process.stdout });
    }, (e) => {
      console.log(e, 'One of the development NPM tasks in ./script/tasks/start.js failed');
    });
} else {
  console.log('STARTING IN PRODUCTION');
  const parallelRunList = [
    "server-react",
    "server-web"
  ];
  runAll(parallelRunList, { parallel: true, stdout: process.stdout });
}
