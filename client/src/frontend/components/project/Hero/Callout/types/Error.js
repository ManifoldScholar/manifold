import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class ProjectHeroCalloutRead extends PureComponent {
  static displayName = "ProjectHero.Callout.Read";

  static propTypes = {
    callout: PropTypes.object,
    blockClass: PropTypes.string,
    showErrors: PropTypes.bool
  };

  static defaultProps = {
    showErrors: false
  };

  get isButton() {
    return this.props.callout.attributes.button;
  }

  render() {
    if (!this.props.showErrors) return null;

    const blockClass = this.props.blockClass;

    const calloutClass = classNames({
      [`${blockClass}__button ${blockClass}__button--error ${blockClass}__button--centered`]: this
        .isButton,
      [`${blockClass}__link ${blockClass}__link--error`]: !this.isButton
    });

    return (
      <span className={calloutClass}>
        <span className={`${blockClass}__button-text`}>
          {this.props.message}
        </span>
      </span>
    );
  }
}
