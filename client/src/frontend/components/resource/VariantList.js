import React, { Component } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

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
      <li key={url} className="resource-variant-list__item">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="resource-variant-list__link"
        >
          <IconComposer
            icon="arrowDown16"
            size="default"
            iconClass="resource-variant-list__link-icon"
          />
          <span className="resource-variant-list__link-text">{filename}</span>
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
        <div className="resource-variant-list__section-title">
          Downloadable Variants:
        </div>
        <ul className="resource-variant-list__list">{children}</ul>
      </section>
    );
  }
}
