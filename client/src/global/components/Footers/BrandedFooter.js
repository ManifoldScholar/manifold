import React, { Component } from "react";
import PropTypes from "prop-types";
import FooterParts from "./Parts";
import { withRouter } from "react-router-dom";
import withPluginReplacement from "hoc/with-plugin-replacement";
import links from "./Parts/helpers/links";

class BrandedFooter extends Component {
  get authenticated() {
    return this.props.authentication.authenticated;
  }

  get settings() {
    return this.props.settings;
  }

  render() {
    return (
      <footer className="app-footer app-footer--branded">
        <FooterParts.Columns>
          <FooterParts.Column position="right">
            <FooterParts.PressLogo settings={this.settings} />
          </FooterParts.Column>
          <FooterParts.Column position="left">
            <FooterParts.Navigation>{links(this.props)}</FooterParts.Navigation>
            <FooterParts.Search withTopMargin push={this.props.history.push} />
          </FooterParts.Column>
        </FooterParts.Columns>
        <FooterParts.Copyright settings={this.props.settings} />
        <FooterParts.PoweredBy dull />
      </footer>
    );
  }
}

export default withRouter(
  withPluginReplacement(
    BrandedFooter,
    "Global.Components.Footers.BrandedFooter"
  )
);
