import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class PressLogo extends Component {
  static propTypes = {
    url: PropTypes.string,
    mobileUrl: PropTypes.string,
    styles: PropTypes.string
  };

  getDefaultIcon() {
    return (
      <div>
        <i className="manicon manicon-manifold-logo" aria-hidden="true" />
        <span className="screen-reader-text">{"Manifold Logo"}</span>
      </div>
    );
  }

  getPressImage() {
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
        className="image"
        style={style}
      />
    );
  }

  getMobilePressImage() {
    return (
      <img
        src={this.props.mobileUrl}
        alt="Publisher Logo: Click to return to the browse page"
        className="image-mobile"
      />
    );
  }

  render() {
    const figureClass = classNames({
      "logo-square": this.props.url
    });

    return (
      <figure className={figureClass}>
        {this.props.url ? this.getPressImage() : this.getDefaultIcon()}
        {this.props.mobileUrl ? this.getMobilePressImage() : null}
      </figure>
    );
  }
}
