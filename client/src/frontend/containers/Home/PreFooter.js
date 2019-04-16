import React, { PureComponent } from "react";
import withPluginReplacement from "hoc/with-plugin-replacement";

class LayoutPreFooter extends PureComponent {
  static displayName = "Layout.PreFooter";

  render() {
    return null;
  }
}

export default withPluginReplacement(
  LayoutPreFooter,
  "Frontend.Components.Layout.PreFooter"
);
