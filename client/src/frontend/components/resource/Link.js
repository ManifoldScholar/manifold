import React, { Component } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

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
            <span className="button-primary__text" aria-hidden>
              Visit Page
            </span>
            <span className="screen-reader-text">
              {`Visit link “${attr.title}”`}
            </span>
            <IconComposer
              icon="arrowRight16"
              size="default"
              iconClass="button-primary__icon"
            />
          </a>
        );
        break;
      default:
        button = attr.downloadable ? (
          <a
            href={attr.attachmentStyles.original}
            className={this.props.buttonClass}
            download={attr.slug}
          >
            <span className="button-primary__text" aria-hidden>
              Download
            </span>
            <span className="screen-reader-text">{`Download ${attr.kind} “${attr.title}”`}</span>
            <IconComposer
              icon="arrowDown16"
              size="default"
              iconClass="button-primary__icon"
            />
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
