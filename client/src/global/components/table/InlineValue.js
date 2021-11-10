import React from "react";
import PropTypes from "prop-types";
import isNil from "lodash/isNil";
import IconComposer from "global/components/utility/IconComposer";

export default class InlineValue extends React.PureComponent {
  static displayName = "GenericTable.InlineValue";

  static propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    srLabel: PropTypes.string,
    icon: PropTypes.string
  };

  get icon() {
    return this.props.icon;
  }

  get label() {
    return this.props.label;
  }

  get hasSrLabel() {
    return !isNil(this.props.srLabel);
  }

  render() {
    return (
      <span className="table__inline-value">
        {this.icon && (
          <IconComposer
            icon={this.icon}
            size={24}
            className="table__inline-icon"
          />
        )}
        <span aria-hidden={this.hasSrLabel}>{this.label}</span>
        {this.hasSrLabel && (
          <span className="screen-reader-text">{this.props.srLabel}</span>
        )}
      </span>
    );
  }
}
