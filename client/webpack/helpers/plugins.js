import path from "path";
import paths from "./paths";
import fs from "fs";

class Plugins {

  constructor() {
    this.pluginNoOp = path.resolve(paths.root, "src/utils/plugins/missingPluginsManifest.js");
    this.componentsEntry = path.resolve(paths.plugins, "components.js");
    this.stylesEntry = path.resolve(paths.plugins, "styles.js");
    this.hasComponents = fs.existsSync(this.componentsEntry);
    this.hasStyles = fs.existsSync(this.stylesEntry);
  }

  get webpackAliases() {
    const baseAliases = {
      plugins$: this.pluginNoOp
    };

    let aliases = baseAliases;

    if (this.hasStyles) {
      const stylesAlias = require(this.stylesEntry).default;
      if (stylesAlias.hasOwnProperty("variables")) aliases["userVariables$"] = stylesAlias.variables;
      if (stylesAlias.hasOwnProperty("styles")) aliases["userStyles$"] = stylesAlias.styles;
    }

    if (this.hasComponents) {
      aliases["plugins$"] = this.componentsEntry;
    }

    if (this.hasPlugins && this.plugins.hasOwnProperty("components")) {
      aliases = Object.assign(aliases, { plugins$: this.pluginsEntry });
    }
    return aliases;
  }

}

export default new Plugins;
