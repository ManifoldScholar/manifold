import React, { Component } from "react";
import withPluginReplacement from "hoc/withPluginReplacement";
import FooterParts from "./Parts";
import { socialLinks } from "./Parts/helpers/links";
// import LanguageSelect from "global/components/LanguageSelect";
import styled from "@emotion/styled";
import * as Styled from "./styles";

const StyledSocialColumn = styled(FooterParts.Column)`
  align-self: center;
`;

class StandaloneFooter extends Component {
  render() {
    return (
      <Styled.StandaloneFooter className="bg-neutral95">
        <FooterParts.Columns standalone>
          <FooterParts.Column position="right">
            <Styled.Actions>{/* <LanguageSelect /> */}</Styled.Actions>
          </FooterParts.Column>
          <StyledSocialColumn position="left">
            <FooterParts.Socials links={socialLinks(this.props)} />
          </StyledSocialColumn>
        </FooterParts.Columns>
        <FooterParts.PoweredBy type="standalone">
          {this.props.settings.attributes.copyrightFormatted && (
            <FooterParts.Copyright
              type="standalone"
              settings={this.props.settings}
            />
          )}
        </FooterParts.PoweredBy>
      </Styled.StandaloneFooter>
    );
  }
}

export default withPluginReplacement(
  StandaloneFooter,
  "Global.Components.Footers.StandaloneFooter"
);
