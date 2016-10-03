import rimraf from 'rimraf';
import path from 'path';

const buildPath = path.join(__dirname, "..", "..", "dist", "build");
rimraf(buildPath, () => { console.log("Build has been cleaned") });
