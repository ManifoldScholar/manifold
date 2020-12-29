import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import Utility from "global/components/utility";
import getOr from "lodash/fp/getOr";
import Error from "./Error";

const getText = getOr({}, "props.callout.relationships.text.attributes");

export default class ProjectHeroCalloutTOC extends PureComponent {
  static displayName = "ProjectHero.CalloutTOC";

  static propTypes = {
    callout: PropTypes.object,
    blockClass: PropTypes.string
  };

  get isButton() {
    return this.props.callout.attributes.button;
  }

  get href() {
    const textAttributes = getText(this);

    const { slug, tocSectionId } = textAttributes;

    if (tocSectionId) {
      return lh.link("readerSection", slug, tocSectionId);
    } else {
      return lh.link("reader", slug);
    }
  }

  get typeClass() {
    return this.isButton ? "button" : "link";
  }

  get title() {
    return this.props.callout.attributes.title || "View Contents";
  }

  get icon() {
    return this.isButton ? "toc64" : "arrowRight16";
  }

  get hasText() {
    return Boolean(this.props.callout.relationships.text);
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
    if (!this.hasText)
      return <Error {...this.props} message={"Text Missing"} />;

    const blockClass = this.props.blockClass;
    const calloutClass = classNames({
      [`${blockClass}__button ${blockClass}__button--secondary`]: this.isButton,
      [`${blockClass}__link`]: !this.isButton
    });

    return (
      <Link to={this.href} className={calloutClass}>
        {this.renderIcon()}
        <span className={`${blockClass}__${this.typeClass}-text`}>
          {this.title}
        </span>
      </Link>
    );
  }
}
