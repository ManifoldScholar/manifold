import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

export default class Avatar extends Component {
  static propTypes = {
    url: PropTypes.string,
    style: PropTypes.object,
    ariaHidden: PropTypes.bool,
    className: PropTypes.string,
    iconSize: PropTypes.oneOf([24, 64])
  };

  static defaultProps = {
    iconSize: 64
  };

  get icon() {
    return `Avatar${this.props.iconSize}`;
  }

  get baseClass() {
    return "avatar";
  }

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
          iconClass={`${this.baseClass}__icon`}
          icon={this.icon}
          size={this.props.iconSize}
        />
        <span className="screen-reader-text">Avatar</span>
      </figure>
    );
  }
}
