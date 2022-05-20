import React, { Component } from "react";
import FooterParts from "./Parts";
import { withRouter } from "react-router-dom";
import withPluginReplacement from "hoc/withPluginReplacement";
import links from "./Parts/helpers/links";
// import LanguageSelect from "global/components/LanguageSelect";
import * as Styled from "./styles";

class DefaultFooter extends Component {
  get authenticated() {
    return this.props.authentication.authenticated;
  }

  render() {
    return (
      <Styled.DefaultFooter className="bg-neutral95">
        <FooterParts.Columns>
          <FooterParts.Column position="right">
            <Styled.Actions>
              <FooterParts.Search push={this.props.history.push} />
              {/* <LanguageSelect /> */}
            </Styled.Actions>
          </FooterParts.Column>
          <FooterParts.Column position="left">
            <FooterParts.Navigation>{links(this.props)}</FooterParts.Navigation>
          </FooterParts.Column>
        </FooterParts.Columns>
        <FooterParts.Columns>
          <FooterParts.Copyright settings={this.props.settings} />
        </FooterParts.Columns>
        <FooterParts.PoweredBy
          withVersion={this.props.withVersion}
          type="library"
          dull={false}
        />
      </Styled.DefaultFooter>
    );
  }
}

export default withRouter(
  withPluginReplacement(
    DefaultFooter,
    "Global.Components.Footers.DefaultFooter"
  )
);
