import React, { Component } from "react";
import PropTypes from "prop-types";
import withPluginReplacement from "hoc/with-plugin-replacement";
import FooterParts from "./Parts";
import { socialLinks } from "./Parts/helpers/links";
import LanguageSelect from "global/components/LanguageSelect";

class StandaloneFooter extends Component {
  render() {
    return (
      <footer className="app-footer app-footer--standalone">
        <FooterParts.Columns>
          <FooterParts.Column position="right">
            <div className="c-footer-forms">
              <LanguageSelect />
            </div>
          </FooterParts.Column>
          <FooterParts.Column position="left">
            <div className="container">
              <FooterParts.Socials links={socialLinks(this.props)} />
            </div>
          </FooterParts.Column>
        </FooterParts.Columns>
        <FooterParts.PoweredBy type="standalone">
          {this.props.settings.attributes.copyrightFormatted && (
            <FooterParts.Copyright
              type="standalone"
              settings={this.props.settings}
            />
          )}
        </FooterParts.PoweredBy>
      </footer>
    );
  }
}

export default withPluginReplacement(
  StandaloneFooter,
  "Global.Components.Footers.StandaloneFooter"
);
