import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Icon } from "components/global/SVG";

export default class PressLogo extends Component {
  static propTypes = {
    url: PropTypes.string,
    mobileUrl: PropTypes.string,
    styles: PropTypes.string
  };

  getDefaultIcon() {
    return (
      <React.Fragment>
        <i className="manicon" aria-hidden="true">
          <Icon.ManifoldLogo size={26} />
        </i>
        <span className="screen-reader-text">{"Manifold Logo"}</span>
      </React.Fragment>
    );
  }

  getPressImage() {
    const className = classNames("image", {
      "image-desktop": this.props.mobileUrl
    });
    let style = {};
    if (this.props.styles) {
      try {
        style = JSON.parse(this.props.styles);
      } catch (e) {
        /* eslint-disable no-console */
        console.log("Error: Invalid press logo styles");
        /* eslint-enable no-console */
      }
    }

    return (
      <img
        src={this.props.url}
        alt="Publisher Logo: Click to return to the browse page"
        className={className}
        style={style}
      />
    );
  }

  getMobilePressImage() {
    const className = classNames("image", {
      "image-mobile": this.props.url
    });
    return (
      <img
        src={this.props.mobileUrl}
        alt="Publisher Logo: Click to return to the browse page"
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
