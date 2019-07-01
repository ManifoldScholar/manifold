import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

export default class Label extends React.PureComponent {
  static propTypes = {
  };

  get icon() {
    return this.props.icon;
  }

  get name() {
    return this.props.label;
  }

  get labelIconClass() {
    return "group-table__label-icon";
  }

  get headingClassNames() {
    return classNames({
      "group-table__table-heading": true,
      "group-table__heading-small": true,
    });
  }

  render() {
    return (
      <span className={this.headingClassNames}>
        {this.icon && (
          <Utility.IconComposer
            icon={this.icon}
            size={24}
            iconClass={this.labelIconClass}
          />
        )}
        {this.name && this.name + ":"}
      </span>
    )
  }
}
