import React, { Component } from "react";
import FooterParts from "./Parts";
import { withRouter } from "react-router-dom";
import withPluginReplacement from "hoc/withPluginReplacement";
import links from "./Parts/helpers/links";
// import LanguageSelect from "global/components/LanguageSelect";
import * as Styled from "./styles";

class BrandedFooter extends Component {
  get authenticated() {
    return this.props.authentication.authenticated;
  }

  get settings() {
    return this.props.settings;
  }

  render() {
    return (
      <Styled.BrandedFooter className="bg-neutral95">
        <FooterParts.Columns>
          <FooterParts.Column position="right" footerType="branded">
            <FooterParts.PressLogo settings={this.settings} />
          </FooterParts.Column>
          <FooterParts.Column position="left">
            <FooterParts.Navigation>{links(this.props)}</FooterParts.Navigation>
            <Styled.Actions>
              <FooterParts.Search
                withTopMargin
                push={this.props.history.push}
              />
              {/* <LanguageSelect /> */}
            </Styled.Actions>
          </FooterParts.Column>
        </FooterParts.Columns>
        <FooterParts.Columns>
          <FooterParts.Copyright settings={this.props.settings} />
        </FooterParts.Columns>
        <FooterParts.PoweredBy dull />
      </Styled.BrandedFooter>
    );
  }
}

export default withRouter(
  withPluginReplacement(
    BrandedFooter,
    "Global.Components.Footers.BrandedFooter"
  )
);
