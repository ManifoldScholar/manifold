import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ResourceLink extends Component {
  static displayName = "Resource.Link";

  static propTypes = {
    attributes: PropTypes.object,
    buttonClass: PropTypes.string
  };

  static defaultProps = {
    buttonClass: "button-primary"
  };

  renderButton(attr) {
    if (attr.kind.toLowerCase() === "link") {
      return (
        <a
          href={attr.externalUrl}
          className={this.props.buttonClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Page{" "}
          <i className="manicon manicon-arrow-right" aria-hidden="true" />
        </a>
      );
    }

    if (attr.downloadable) {
      return (
        <a
          href={attr.attachmentStyles.original}
          download=""
          type="submit"
          className={this.props.buttonClass}
        >
          Download{" "}
          <i className="manicon manicon-arrow-down" aria-hidden="true" />
        </a>
      );
    }
    return null;
  }

  render() {
    return this.renderButton(this.props.attributes);
  }
}
