import React, { Component } from "react";
import withPluginReplacement from "hoc/withPluginReplacement";
import withSettings from "hoc/withSettings";
import DefaultFooter from "./DefaultFooter";
import BrandedFooter from "./BrandedFooter";
import StandaloneFooter from "./StandaloneFooter";
import { FrontendModeContext } from "helpers/contexts";

class FrontendFooter extends Component {
  static contextType = FrontendModeContext;

  get isBranded() {
    const pressLogo = this.props.settings.attributes.pressLogoFooterStyles;
    if (!pressLogo) return false;
    if (!pressLogo.original) return false;
    return true;
  }

  render() {
    const { settings } = this.props;
    const libraryDisabled = settings.attributes.general.libraryDisabled;

    if (libraryDisabled || (this.context && this.context.isStandalone))
      return <StandaloneFooter {...this.props} />;
    if (this.isBranded) return <BrandedFooter {...this.props} />;
    return <DefaultFooter {...this.props} />;
  }
}

export default withSettings(
  withPluginReplacement(
    FrontendFooter,
    "Global.Components.Footers.FrontendFooter"
  )
);
