import transformImports from "transform-imports";
import startsWith from "lodash/startsWith";
import endsWith from "lodash/endsWith";
import path from "path";
import fs from "fs";
import { trueCasePathSync } from "true-case-path";

/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
module.exports = function fixImportCase(fileInfo, api, optionsIgnored) {
  const newCode = transformImports(fileInfo.source, importDefs => {
    importDefs.forEach(importDef => {
      const { source } = importDef;
      let absSource;
      let isRel = false;

      if (startsWith(source, ".")) {
        isRel = true;
        const from = path.dirname(fileInfo.path);
        absSource = path.resolve(from, source);
      } else if (
        startsWith(source, "backend") ||
        startsWith(source, "frontend") ||
        startsWith(source, "global") ||
        startsWith(source, "hoc") ||
        startsWith(source, "helpers") ||
        startsWith(source, "store") ||
        startsWith(source, "utils")
      ) {
        absSource = path.resolve("src", source);
      }

      if (absSource) {
        if (!fs.existsSync(absSource)) absSource = `${absSource}.js`;
        if (!fs.existsSync(absSource)) {
          console.error("#########################");
          console.error("Incorrect import");
          console.error("#########################");
          console.error("IN      ", fileInfo.path);
          console.error("SOURCE  ", source);
          console.error("ABS     ", absSource);
        }

        const trueFsPath = trueCasePathSync(absSource);
        if (absSource !== trueFsPath) {
          let newSource;
          if (isRel) {
            newSource = path.relative(fileInfo.path, trueFsPath);
          } else if (endsWith(trueFsPath, ".js")) {
            newSource = trueFsPath.slice(source.length * -1 - 3);
          } else {
            newSource = trueFsPath.slice(source.length * -1);
          }
          if (startsWith(source, "./") && startsWith(newSource, "../"))
            newSource = newSource.substr(1);
          if (startsWith(source, "../") && startsWith(newSource, "../"))
            newSource = newSource.substr(3);
          if (endsWith(newSource, ".js")) newSource = newSource.slice(0, -3);
          console.log(`Transforming import in ${fileInfo.path}:`);
          console.log(`   from: ${source}`);
          console.log(`     to: ${newSource}`);
          importDef.source = newSource;
        }
      }
    });
  });

  return newCode;
};
/* eslint-enable no-console */
/* eslint-enable no-param-reassign */
