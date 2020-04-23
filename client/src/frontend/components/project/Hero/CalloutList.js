import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Callout from "./Callout/index";

export default class ProjectHeroCalloutList extends PureComponent {
  static displayName = "ProjectHero.CalloutList";

  static propTypes = {
    callouts: PropTypes.array.isRequired,
    authorized: PropTypes.bool,
    blockClass: PropTypes.string,
    layoutClass: PropTypes.string,
    visibilityClass: PropTypes.string,
    showErrors: PropTypes.bool
  };

  static defaultProps = {
    authorized: false,
    showErrors: false
  };

  get callouts() {
    return this.props.callouts;
  }

  byVisibility(callouts) {
    const { authorized } = this.props;
    return callouts.filter(callout => {
      const { kind, visibility } = callout.attributes;
      if (!authorized && kind !== "link" && kind !== "download") return false;
      if (visibility === "always") return true;
      if (authorized) return visibility === "authorized";
      if (!authorized) return visibility === "unauthorized";
      return false;
    });
  }

  get buttons() {
    return this.byVisibility(
      this.callouts.filter(callout => callout.attributes.button)
    );
  }

  get links() {
    return this.byVisibility(
      this.callouts.filter(callout => !callout.attributes.button)
    );
  }

  get showErrors() {
    return this.props.showErrors;
  }

  renderCallouts(callouts) {
    const calloutClass = "action-callout-list";
    const layoutClass = this.props.layoutClass;

    return (
      <>
        <div
          className={classNames(`${calloutClass}`, {
            [`${calloutClass}--${layoutClass}`]: layoutClass
          })}
        >
          {callouts.map(callout => (
            <Callout
              showErrors={this.showErrors}
              key={callout.id}
              callout={callout}
              blockClass={calloutClass}
            />
          ))}
        </div>
      </>
    );
  }

  render() {
    if (this.callouts.length === 0) return null;
    const { blockClass, visibilityClass } = this.props;

    return (
      <div
        className={classNames(`${blockClass}__callout-block`, {
          [`${blockClass}__callout-block--${visibilityClass}`]: visibilityClass
        })}
      >
        {this.buttons.length > 0 && this.renderCallouts(this.buttons)}
        {this.links.length > 0 && this.renderCallouts(this.links)}
      </div>
    );
  }
}
