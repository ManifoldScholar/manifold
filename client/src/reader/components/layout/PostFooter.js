import withPluginReplacement from "hoc/withPluginReplacement";

function LayoutPostFooter() {
  return null;
}

LayoutPostFooter.displayName = "Reader.Layout.PostFooter";

export default withPluginReplacement(
  LayoutPostFooter,
  "Reader.Components.Layout.PostFooter"
);
