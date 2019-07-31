import React, { PureComponent } from "react";
import withPluginReplacement from "hoc/with-plugin-replacement";

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

  render() {
    return (
      <a
        href={this.pressSite}
        target="_blank"
        rel="noopener noreferrer"
        className="app-footer__press-logo"
      >
        <img
          className="app-footer__press-logo-image"
          alt="Press Site"
          src={this.pressLogo.original}
        />
      </a>
    );
  }
}

export default withPluginReplacement(
  PressLogo,
  "Global.Components.Footer.PressLogo"
);
