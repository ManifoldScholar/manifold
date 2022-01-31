import React, { PureComponent } from "react";
import withPluginReplacement from "hoc/withPluginReplacement";

class LayoutCustomHeader extends PureComponent {
  static displayName = "Layout.Header.CustomHeader";

  render() {
    return null;
  }
}

export default withPluginReplacement(
  LayoutCustomHeader,
  "Frontend.Components.Layout.Header.CustomHeader"
);
