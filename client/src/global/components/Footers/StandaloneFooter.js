import React, { Component } from "react";
import PropTypes from "prop-types";
import withPluginReplacement from "hoc/with-plugin-replacement";
import FooterParts from "./Parts";
import { socialLinks } from "./Parts/helpers/links";

class StandaloneFooter extends Component {

  render() {
    return (
      <footer className="app-footer app-footer--standalone">
        <div className="container">
          <FooterParts.Socials
            links={socialLinks(this.props)}
          />
        </div>
        <FooterParts.PoweredBy type="standalone">
          <FooterParts.Copyright
            type="standalone"
            settings={this.props.settings}
          />
        </FooterParts.PoweredBy>
      </footer>
    )
  }
}

export default withPluginReplacement(StandaloneFooter, "Global.Components.Footers.StandaloneFooter");
