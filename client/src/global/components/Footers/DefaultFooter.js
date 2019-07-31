import React, { Component } from "react";
import PropTypes from "prop-types";
import FooterParts from "./Parts";
import { withRouter } from "react-router-dom";
import withPluginReplacement from "hoc/with-plugin-replacement";
import links from "./Parts/helpers/links";

class DefaultFooter extends Component {
  get authenticated() {
    return this.props.authentication.authenticated;
  }

  render() {
    return (
      <footer className="app-footer app-footer--default">
        <FooterParts.Columns>
          <FooterParts.Column position="right">
            <FooterParts.Search push={this.props.history.push} />
          </FooterParts.Column>
          <FooterParts.Column position="left">
            <FooterParts.Navigation>{links(this.props)}</FooterParts.Navigation>
          </FooterParts.Column>
        </FooterParts.Columns>
        <FooterParts.Copyright settings={this.props.settings} />
        <FooterParts.PoweredBy type="library" dull={false} />
      </footer>
    );
  }
}

export default withRouter(
  withPluginReplacement(
    DefaultFooter,
    "Global.Components.Footers.DefaultFooter"
  )
);
