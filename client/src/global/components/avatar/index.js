import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

export default class Avatar extends Component {
  static propTypes = {
    url: PropTypes.string,
    style: PropTypes.object,
    ariaHidden: PropTypes.bool,
    className: PropTypes.string
  };

  get baseClass() {
    return "avatar"
  };

  get className() {
    return classNames(this.baseClass, this.props.className);
  }

  render() {
    if (this.props.url) {
      const style = {
        backgroundSize: "cover",
        backgroundPosition: "50% 50%",
        backgroundImage: `url(${this.props.url})`,
        width: "100%",
        height: 0,
        paddingTop: "100%",
        borderRadius: "100%"
      };
      return (
        <figure
          style={this.props.style}
          className={this.className}
          aria-hidden={this.props.ariaHidden}
        >
          <span className="screen-reader-text">Avatar</span>
          <div style={style} />
        </figure>
      );
    }
    return (
      <figure
        style={this.props.style}
        className={this.className}
        aria-hidden={this.props.ariaHidden}
      >
        <Utility.IconComposer
          icon="Avatar64"
          size="default"
          iconClass={`${this.baseClass}__icon`}
        />
        <span className="screen-reader-text">Avatar</span>
      </figure>
    );
  }
}
