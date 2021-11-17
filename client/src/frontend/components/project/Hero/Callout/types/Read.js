import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Error from "./Error";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import Utility from "global/components/utility";

export default class ProjectHeroCalloutRead extends PureComponent {
  static displayName = "ProjectHero.Callout.Read";

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

  get hasText() {
    return Boolean(this.props.callout.relationships.text);
  }

  get slug() {
    return this.props.callout.relationships.text.attributes.slug;
  }

  get title() {
    return this.props.callout.attributes.title || "Start Reading";
  }

  get icon() {
    return this.isButton ? "glasses64" : "arrowRight16";
  }

  get iconSize() {
    return this.isButton ? 46 : 17.333;
  }

  renderIcon() {
    return (
      <Utility.IconComposer
        icon={this.icon}
        size={this.iconSize}
        className={`${this.props.blockClass}__${this.typeClass}-icon`}
      />
    );
  }

  render() {
    if (!this.hasText)
      return <Error {...this.props} message={"Text Missing"} />;

    const blockClass = this.props.blockClass;
    const calloutClass = classNames({
      [`${blockClass}__button ${blockClass}__button--primary`]: this.isButton,
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
