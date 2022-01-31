import React, { Component } from "react";
import withPluginReplacement from "hoc/withPluginReplacement";
import FooterParts from "./Parts";
import * as Styled from "./styles";

class ReaderFooter extends Component {
  get text() {
    return this.props.text;
  }

  get copyright() {
    if (!this.text.attributes.metadataFormatted.rights) return null;
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: this.text.attributes.metadataFormatted.rights
        }}
      />
    );
  }

  render() {
    return (
      <Styled.ReaderFooter className="bg-neutral95 app-footer">
        <FooterParts.PoweredBy type="reader">
          {this.copyright}
        </FooterParts.PoweredBy>
      </Styled.ReaderFooter>
    );
  }
}

export default withPluginReplacement(
  ReaderFooter,
  "Global.Components.Footers.ReaderFooter"
);
