import React, { PureComponent } from "react";
import withPluginReplacement from "hoc/with-plugin-replacement";
import FooterSearch from "../utility/FooterSearch";

class LayoutFooterLogo extends PureComponent {
  static displayName = "Layout.FooterLogo";

  renderPressLogo(pressLogo, pressSite) {
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

  renderSearchForm() {
    return (
      <FooterSearch push={this.props.push}></FooterSearch>
    );
  }

  render() {
    const { pressSite, pressLogo, isPressLogo } = this.props;

    return (
      <span>
        {isPressLogo
          ? this.renderPressLogo(pressLogo, pressSite)
          : this.renderSearchForm()}
      </span>
    )
  }
}

export default withPluginReplacement(
  LayoutFooterLogo,
  "Frontend.Components.Layout.FooterLogo"
);
