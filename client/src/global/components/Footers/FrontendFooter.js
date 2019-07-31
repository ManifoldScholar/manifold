import React, { Component } from "react";
import withPluginReplacement from "hoc/with-plugin-replacement";
import DefaultFooter from "./DefaultFooter";
import BrandedFooter from "./BrandedFooter";
import StandaloneFooter from "./StandaloneFooter";
import { FrontendModeContext } from "helpers/contexts";

class FrontendFooter extends Component {
  static contextType = FrontendModeContext;

  get isBranded() {
    const pressLogo = this.props.settings.attributes.pressLogoFooterStyles;
    return pressLogo && pressLogo.original !== null;
  }

  render() {
    if (this.context && this.context.isStandalone)
      return <StandaloneFooter {...this.props} />;
    if (this.isBranded) return <BrandedFooter {...this.props} />;
    return <DefaultFooter {...this.props} />;
  }
}

export default withPluginReplacement(
  FrontendFooter,
  "Global.Components.Footers.FrontendFooter"
);
