import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";
import { Link } from "react-router-dom";

export default class ProjectHeroCalloutLink extends PureComponent {
  static displayName = "ProjectHero.Callout.Link";

  static propTypes = {
    callout: PropTypes.object,
    blockClass: PropTypes.string
  };

  get isButton() {
    return this.props.callout.attributes.button;
  }

  get typeClass() {
    return this.isButton ? "button" : "link";
  }

  get url() {
    return this.props.callout.attributes.url;
  }

  get title() {
    return this.props.callout.attributes.title || "Link";
  }

  get icon() {
    return !this.isButton ? "arrowRight16" : null;
  }

  get iconSize() {
    return this.isButton ? 46 : 17.333;
  }

  get blockClass() {
    return this.props.blockClass;
  }

  get calloutClass() {
    return classNames({
      [`${this.blockClass}__button ${this.blockClass}__button--secondary ${
        this.blockClass
      }__button--centered`]: this.isButton,
      [`${this.blockClass}__link`]: !this.isButton
    });
  }

  get iconComponent() {
    return (
      <Utility.IconComposer
        icon={this.icon}
        size={this.iconSize}
        iconClass={`${this.blockClass}__${this.typeClass}-icon`}
      />
    );
  }

  get isExternal() {
    return this.props.callout.attributes.externalLink;
  }

  get contents() {
    return (
      <>
        {this.icon && this.iconComponent}
        <span className={`${this.blockClass}__${this.typeClass}-text`}>
          {this.title}
        </span>
      </>
    );
  }

  renderExternalLink() {
    return (
      <a
        href={this.url}
        className={this.calloutClass}
        target="_blank"
        rel="noopener noreferrer"
      >
        {this.contents}
      </a>
    );
  }

  renderLink() {
    return (
      <Link to={this.url} className={this.calloutClass}>
        {this.contents}
      </Link>
    );
  }

  render() {
    if (!this.url) return null;

    return this.isExternal ? this.renderExternalLink() : this.renderLink();
  }
}
