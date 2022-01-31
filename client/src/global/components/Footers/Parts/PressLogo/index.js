import React, { PureComponent } from "react";
import withPluginReplacement from "hoc/withPluginReplacement";
import * as Styled from "./styles";

class PressLogo extends PureComponent {
  static displayName = "Global.Footers.Parts.PressLogo";

  get settings() {
    return this.props.settings;
  }

  get pressLogo() {
    return this.settings.attributes.pressLogoFooterStyles;
  }

  get pressSite() {
    return this.settings.attributes.general.pressSite;
  }

  get pressName() {
    return this.settings.attributes.general.defaultPublisher;
  }

  render() {
    return (
      <Styled.Link
        href={this.pressSite}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Styled.Image
          alt={`Logo of ${this.pressName}`}
          src={this.pressLogo.original}
        />
      </Styled.Link>
    );
  }
}

export default withPluginReplacement(
  PressLogo,
  "Global.Components.Footer.PressLogo"
);
