import withVoids from "./withVoids";
import withInlines from "./withInlines";
import withImages from "./withImages";
import withShortcuts from "./withShortcuts";
import withHtmlAwareBreaks from "./withHtmlAwareBreaks";

const withPlugins = editor =>
  withInlines(
    withHtmlAwareBreaks(withShortcuts(withVoids(withImages(editor))))
  );

export default withPlugins;

export { withVoids, withInlines, withImages, withShortcuts };
