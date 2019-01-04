import React, { PureComponent } from "react";
import withPluginReplacement from "hoc/with-plugin-replacement";

class LayoutPostFooter extends PureComponent {
  static displayName = "Layout.PostFooter";

  render() {
    return null;
  }
}

export default withPluginReplacement(
  LayoutPostFooter,
  "Frontend.Components.Layout.PostFooter"
);
