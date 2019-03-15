import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import Utility from "global/components/utility";

export default class ProjectHeroCalloutTOC extends PureComponent {
  static displayName = "ProjectHero.CalloutTOC";

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

  get slug() {
    return this.props.callout.relationships.text.attributes.slug;
  }

  get title() {
    return this.props.callout.attributes.title || "View Contents";
  }

  get icon() {
    return this.isButton ? "toc64" : "arrow16";
  }

  get iconSize() {
    return this.isButton ? 46 : 17.333;
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
    const blockClass = this.props.blockClass;
    const calloutClass = classNames({
      [`${blockClass}__button ${blockClass}__button--secondary`]: this.isButton,
      [`${blockClass}__link`]: !this.isButton
    });

    return (
      <Link to={lh.link("reader", this.slug)} className={calloutClass}>
        {this.renderIcon()}
        <span className={`${blockClass}__${this.typeClass}-text`}>
          {this.title}
        </span>
      </Link>
    );
  }
}
