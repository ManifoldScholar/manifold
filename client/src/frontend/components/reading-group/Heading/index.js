import React from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";
import classNames from "classnames";
import GroupNavButtons from "./GroupNavButtons";

export default class Heading extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    subtitle: PropTypes.node,
    buttons: PropTypes.array
  };

  static defaultProps = {
    buttons: []
  };

  get hasButtons() {
    const { buttons } = this.props;
    return buttons.length > 0;
  }

  get textContainerClassNames() {
    return classNames({
      "group-page-heading__text-container": true,
      "group-page-heading__text-container--narrow": this.hasButtons
    });
  }

  render() {
    const { children, subtitle, buttons } = this.props;
    return (
      <div className={"group-page-heading"}>
        <div className={this.textContainerClassNames}>
          <Utility.IconComposer
            icon="annotationGroup24"
            size={32}
            iconClass={"group-page-heading__icon"}
          />
          <h1 className={"heading-primary group-page-heading__text"}>
            {children}
            {subtitle && (
              <span className={"group-page-heading__subtitle"}>
                {": Members"}
              </span>
            )}
          </h1>
        </div>
        {this.hasButtons && <GroupNavButtons links={buttons} />}
      </div>
    );
  }
}
