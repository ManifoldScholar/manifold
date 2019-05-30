import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Callout from "./Callout/index";

export default class ProjectHeroCalloutList extends PureComponent {
  static displayName = "ProjectHero.CalloutList";

  static propTypes = {
    callouts: PropTypes.array.isRequired,
    blockClass: PropTypes.string,
    layoutClass: PropTypes.string,
    visibilityClass: PropTypes.string,
    showErrors: PropTypes.bool
  };

  static defaultProps = {
    showErrors: false
  };

  get callouts() {
    return this.props.callouts;
  }

  get buttons() {
    return this.callouts.filter(callout => callout.attributes.button);
  }

  get links() {
    return this.callouts.filter(callout => !callout.attributes.button);
  }

  get showErrors() {
    return this.props.showErrors;
  }

  renderCallouts(callouts) {
    const calloutClass = "action-callout-list";
    const layoutClass = this.props.layoutClass;

    return (
      <React.Fragment>
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
      </React.Fragment>
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
