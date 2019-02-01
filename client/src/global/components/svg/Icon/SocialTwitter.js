import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class IconSocialTwitter extends Component {
  static displayName = "Icon.SocialTwitter";

  static propTypes = {
    iconClass: PropTypes.string,
    size: PropTypes.number,
    fill: PropTypes.string,
    stroke: PropTypes.string
  };

  static defaultProps = {
    size: 32,
    fill: "currentColor"
  };

  render() {
    const { iconClass, size, fill, stroke } = this.props;
    const classes = classnames("manicon-svg", iconClass);

    return (
      <svg
        className={classes}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill={fill}
        stroke={stroke}
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        <path d="M30 7.316c-1.048.465-2.16.77-3.3.905a5.761 5.761 0 0 0 2.527-3.179 11.5 11.5 0 0 1-3.648 1.395 5.75 5.75 0 0 0-9.789 5.239A16.309 16.309 0 0 1 3.95 5.674a5.75 5.75 0 0 0 1.778 7.67 5.72 5.72 0 0 1-2.602-.72v.073a5.748 5.748 0 0 0 4.607 5.633 5.756 5.756 0 0 1-2.595.098 5.75 5.75 0 0 0 5.367 3.99 11.526 11.526 0 0 1-7.135 2.459c-.458 0-.915-.027-1.37-.08a16.26 16.26 0 0 0 8.806 2.58c10.566 0 16.344-8.753 16.344-16.344 0-.249-.005-.496-.016-.743A11.675 11.675 0 0 0 30 7.316z" />
      </svg>
    );
  }
}
