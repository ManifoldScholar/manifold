import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ResourceVariantList extends Component {
  static displayName = "Resource.VariantList";

  static propTypes = {
    resource: PropTypes.object
  };

  renderVariant(variant) {
    const url = this.props.resource.attributes[`${variant}Url`];
    const filename = this.props.resource.attributes[`${variant}FileName`];
    if (!filename || !url) return null;

    return (
      <li key={url}>
        <a href={url} target="_blank">
          <i className="manicon manicon-arrow-down" />
          <span>{filename}</span>
        </a>
      </li>
    );
  }

  renderVariants() {
    const variants = ["variantFormatOne", "variantFormatTwo", "highRes"];
    return variants
      .map(variant => {
        return this.renderVariant(variant);
      })
      .filter(item => item);
  }

  render() {
    const children = this.renderVariants();
    if (children.length === 0) return null;

    return (
      <section className="resource-variant-list">
        <div className="section-title">Downloadable Variants:</div>
        {children}
      </section>
    );
  }
}
