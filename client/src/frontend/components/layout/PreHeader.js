import React, { PureComponent } from "react";
import withPluginReplacement from "hoc/with-plugin-replacement";

class LayoutPreHeader extends PureComponent {
  static displayName = "Layout.PreHeader";

  render() {
    return null;
  }
}

export default withPluginReplacement(
  LayoutPreHeader,
  "Frontend.Components.Layout.PreHeader"
);
