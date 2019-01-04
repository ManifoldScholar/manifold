import path from "path";
import paths from "./paths";
import fs from "fs";

class Plugins {

  constructor() {
    this.sassNoOp = path.resolve(paths.root, "src/utils/plugins/null.scss");
    this.pluginNoOp = path.resolve(paths.root, "src/utils/plugins/missingPluginsManifest.js");
    this.pluginsEntry = path.resolve(paths.plugins, "plugins.js");
    this.customEntry = path.resolve(paths.plugins, "custom.js");
    this.hasPlugins = fs.existsSync(this.pluginsEntry);
    this.hasCustom = fs.existsSync(this.customEntry);
  }

  get webpackAliases() {
    const baseAliases = {
      userVariables$: this.sassNoOp,
      userStyles$: this.sassNoOp,
      plugins$: this.pluginNoOp
    };

    let aliases;

    if (this.hasCustom) {
      const customAlias = require(this.customEntry).alias;
      aliases = Object.assign(baseAliases, customAlias);
    }

    if (this.hasPlugins) {
      aliases = Object.assign(aliases, { plugins$: this.pluginsEntry });
    }

    return aliases;
  }

}

export default new Plugins;
