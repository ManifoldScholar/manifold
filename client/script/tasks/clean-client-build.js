import rimraf from 'rimraf';
import path from 'path';

const buildPath = path.join(__dirname, "..", "..", "dist", "build", "client");
rimraf(buildPath, () => { console.log("Build has been cleaned"); });
process.exit()
