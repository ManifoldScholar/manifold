import React, { PureComponent } from "react";
import withPluginReplacement from "hoc/with-plugin-replacement";

class LayoutPreHeader extends PureComponent {
  static displayName = "Reader.Layout.PreHeader";

  render() {
    return null;
  }
}

export default withPluginReplacement(
  LayoutPreHeader,
  "Reader.Components.Layout.PreHeader"
);
