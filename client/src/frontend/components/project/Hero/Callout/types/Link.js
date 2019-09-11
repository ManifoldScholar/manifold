import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Helper from "global/components/helper";
import Utility from "global/components/utility";

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
      [`${this.blockClass}__button ${this.blockClass}__button--secondary ${this.blockClass}__button--centered`]: this
        .isButton,
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

  render() {
    if (!this.url) return null;
    return (
      <Helper.UserLink url={this.url} className={this.calloutClass}>
        {this.contents}
      </Helper.UserLink>
    );
  }
}
