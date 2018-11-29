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
    let button;
    switch (attr.kind.toLowerCase()) {
      case "link":
        button = (
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
        break;
      default:
        button = attr.downloadable ? (
          <a
            href={attr.attachmentStyles.original}
            className={this.props.buttonClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download{" "}
            <i className="manicon manicon-arrow-down" aria-hidden="true" />
          </a>
        ) : null;
        break;
    }

    return button;
  }

  render() {
    return this.renderButton(this.props.attributes);
  }
}
