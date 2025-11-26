import withPluginReplacement from "hoc/withPluginReplacement";

function LayoutPreHeader() {
  return null;
}

LayoutPreHeader.displayName = "Reader.Layout.PreHeader";

export default withPluginReplacement(
  LayoutPreHeader,
  "Reader.Components.Layout.PreHeader"
);
