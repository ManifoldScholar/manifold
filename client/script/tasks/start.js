import runAll from 'npm-run-all';


//    "start-prod": "npm-run-all clean-builds build-prod-client --parallel build-server-react build-server-web server-react server-web",
//    "start": "npm-run-all clean-builds build-universal-dll --parallel build-server-react build-server-web server-react server-assets server-web",


if(__DEVELOPMENT__) {
  // We need to clean our builds first, and then build the shared vendor DLL.
  runAll(["clean-builds", "build-universal-dll"], { parallel: false, stdout: process.stdout }).
    then(() => {
    // Once those are built, we can build server code and start servers. The universal library
    // we're using will wait to start the srevers until the server code exists, which is why
    // these can be run in parallel.
     runAll(["build-server-react", "build-server-web", "server-react", "server-assets", "server-web"],
       { parallel: true, stdout: process.stdout });
  }, (e) => { console.log(e, 'One of the development NPM tasks in ./script/tasks/start.js failed') });
} else {
  runAll(["clean-builds", "build-prod-client"], { parallel: false, stdout: process.stdout }).
  then(() => {
    runAll(["build-server-react", "build-server-web", "server-react", "server-web"],
      { parallel: true, stdout: process.stdout });
  }, (e) => { console.log(e, 'One of the production NPM tasks in ./script/tasks/start.js failed') });
}
