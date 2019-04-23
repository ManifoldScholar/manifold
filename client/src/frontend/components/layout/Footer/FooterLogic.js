import React, { PureComponent } from "react";
import withPluginReplacement from "hoc/with-plugin-replacement";

class FooterLogic extends PureComponent {
  static displayName = "Layout.Footer.FooterLogic";

  get searchPosition() {
    const pressLogo = this.props.pressLogo;
    const hasLogo = pressLogo && pressLogo.original !== null;
    return hasLogo ? "left" : "right";
  }

  render() {
    return this.props.children(this.searchPosition);
  }
}

export default withPluginReplacement(
  FooterLogic,
  "Frontend.Components.Layout.Footer.FooterLogic"
);
