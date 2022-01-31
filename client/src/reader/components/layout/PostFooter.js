import React, { PureComponent } from "react";
import withPluginReplacement from "hoc/withPluginReplacement";

class LayoutPostFooter extends PureComponent {
  static displayName = "Reader.Layout.PostFooter";

  render() {
    return null;
  }
}

export default withPluginReplacement(
  LayoutPostFooter,
  "Reader.Components.Layout.PostFooter"
);
