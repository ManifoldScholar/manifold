import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

export default class ProjectHeroCalloutDownload extends PureComponent {
  static displayName = "ProjectHero.Callout.Download";

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
    return this.props.callout.attributes.attachmentStyles.original;
  }

  get title() {
    return this.props.callout.attributes.title || "Download";
  }

  get icon() {
    return "arrowDown16";
  }

  get iconSize() {
    return this.isButton ? 22.662 : 17.333;
  }

  renderIcon() {
    return (
      <Utility.IconComposer
        icon={this.icon}
        size={this.iconSize}
        iconClass={`${this.props.blockClass}__${this.typeClass}-icon`}
      />
    );
  }

  render() {
    if (!this.url) return null;

    const blockClass = this.props.blockClass;
    const calloutClass = classNames({
      [`${blockClass}__button ${blockClass}__button--secondary`]: this.isButton,
      [`${blockClass}__link`]: !this.isButton
    });

    return (
      <a
        href={this.url}
        className={calloutClass}
        target="_blank"
        rel="noopener noreferrer"
      >
        {this.renderIcon()}
        <span className={`${blockClass}__${this.typeClass}-text`}>
          {this.title}
        </span>
      </a>
    );
  }
}
