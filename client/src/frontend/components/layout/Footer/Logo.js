import React, { PureComponent } from "react";
import withPluginReplacement from "hoc/with-plugin-replacement";

class Logo extends PureComponent {
  static displayName = "Layout.Footer.Logo";

  render() {
    const { pressSite, pressLogo } = this.props;

    return (
      <a
        href={pressSite}
        target="_blank"
        rel="noopener noreferrer"
        className="press-logo"
      >
        <img className="logo-image" alt="Press Site" src={pressLogo.original} />
      </a>
    );
  }
}

export default withPluginReplacement(
  Logo,
  "Frontend.Components.Layout.Footer.Logo"
);
