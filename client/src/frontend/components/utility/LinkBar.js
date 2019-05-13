import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class LinkBar extends PureComponent {
  static displayName = "Layout.LinkBar";

  static propTypes = {
    url: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    bgColor: PropTypes.string
  };

  get defaultBgColor() {
    return "#52E3AC";
  }

  get styles() {
    return {
      backgroundColor: this.props.bgColor || this.defaultBgColor
    };
  }

  render() {
    const { url, label } = this.props;

    return (
      <a
        href={url}
        rel="noopener noreferrer"
        className="link-bar"
        style={this.styles}
      >
        <div className="link-bar__inner">
          <span className="link-bar__text">{label}</span>
        </div>
      </a>
    );
  }
}
