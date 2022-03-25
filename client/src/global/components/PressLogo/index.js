import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import classNames from "classnames";
import Utility from "global/components/utility";

class PressLogo extends Component {
  static propTypes = {
    url: PropTypes.string,
    mobileUrl: PropTypes.string,
    styles: PropTypes.string,
    t: PropTypes.func
  };

  getDefaultIcon() {
    return (
      <>
        <Utility.IconComposer size={26} icon="manifoldLogo32" />
        <span className="screen-reader-text">
          {this.props.t("app.manifold_logo")}
        </span>
      </>
    );
  }

  getPressImage() {
    const className = classNames("custom-logo__image", {
      "custom-logo__image--desktop": this.props.mobileUrl
    });
    let style = {};
    if (this.props.styles) {
      try {
        style = JSON.parse(this.props.styles);
      } catch (e) {
        /* eslint-disable no-console */
        console.log(this.props.t("errors.logo_styles"));
        /* eslint-enable no-console */
      }
    }

    return (
      <img
        src={this.props.url}
        alt={this.props.t("img_alts.publisher_logo")}
        className={className}
        style={style}
      />
    );
  }

  getMobilePressImage() {
    const className = classNames("custom-logo__image", {
      "custom-logo__image--mobile": this.props.url
    });
    return (
      <img
        src={this.props.mobileUrl}
        alt={this.props.t("img_alts.publisher_logo")}
        className={className}
      />
    );
  }

  render() {
    const figureClass = classNames({
      "custom-logo": this.props.url
    });

    return (
      <figure className={figureClass}>
        {this.props.url ? this.getPressImage() : null}
        {this.props.mobileUrl ? this.getMobilePressImage() : null}
        {!this.props.url && !this.props.mobileUrl
          ? this.getDefaultIcon()
          : null}
      </figure>
    );
  }
}

export default withTranslation()(PressLogo);
