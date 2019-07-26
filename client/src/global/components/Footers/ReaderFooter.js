import React, { Component } from "react";
import PropTypes from "prop-types";
import withPluginReplacement from "hoc/with-plugin-replacement";
import FooterParts from "./Parts";

class ReaderFooter extends Component {

  get text() {
    return this.props.text;
  }

  get copyright() {
    if (!this.text.attributes.metadataFormatted.rights) return null;
    return (
      <div
        className="app-footer-reader__rights"
        dangerouslySetInnerHTML={{
          __html: this.text.attributes.metadataFormatted.rights
        }}
      />
    );
  }

  render() {
    return (
      <footer className="app-footer app-footer--reader">
        <FooterParts.PoweredBy type="reader">
          {this.copyright}
        </FooterParts.PoweredBy>
      </footer>
    )
  }
}

export default withPluginReplacement(ReaderFooter, "Global.Components.Footers.ReaderFooter");
