import React, { Component } from "react";
import withPluginReplacement from "hoc/withPluginReplacement";
import FooterParts from "./Parts";
import { withTranslation } from "react-i18next";
import * as Styled from "./styles";

class ReaderFooter extends Component {
  get text() {
    return this.props.text;
  }

  get copyright() {
    const metadata = this.text.attributes.metadataFormatted;
    if (!metadata.rights && !metadata.citationOverride) return null;

    const html =
      metadata.citationOverride && metadata.rights
        ? `<p>${metadata.citationOverride}</p><p>${metadata.rights}<p>`
        : (metadata.rights ?? metadata.citationOverride);

    return (
      <Styled.Copyright
        dangerouslySetInnerHTML={{
          __html: html,
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

export default withTranslation()(
  withPluginReplacement(ReaderFooter, "Global.Components.Footers.ReaderFooter"),
);
