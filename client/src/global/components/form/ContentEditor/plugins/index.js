import withVoids from "./withVoids";
import withInlines from "./withInlines";
import withImages from "./withImages";
import withShortcuts from "./withShortcuts";

const withPlugins = editor =>
  withShortcuts(withInlines(withVoids(withImages(editor))));

export default withPlugins;

export { withVoids, withInlines, withImages, withShortcuts };
