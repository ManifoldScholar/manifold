import path from "path";
import environment from "./environment";

class Paths {

  constructor() {
    this._root = path.resolve(__dirname, "../..");
    this._src = path.resolve(this.root, "./src");
    this._plugins = path.resolve(this.root, "./plugins");
    this._build = path.resolve(this.root, environment.buildIn, "dist/manifold")
  }

  get root() {
    return this._root;
  }

  get src() {
    return this._src;
  }

  get plugins() {
    return this._plugins;
  }

  get build() {
    return this._build;
  }

}

export default new Paths;
