import rimraf from 'rimraf';
import path from 'path';

const buildPath = path.join(__dirname, "..", "..", "dist", "build");
rimraf(buildPath, () => {
  console.log(`${buildPath} has been cleaned`);
  process.exit();
});

