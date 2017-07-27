import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import isString from "lodash/isString";
import classNames from "classnames";

export default class FieldGroup extends PureComponent {
  static propTypes = {
    horizontal: PropTypes.bool,
    instructions: PropTypes.string,
    label: PropTypes.string
  };

  static defaultProps = {
    horizontal: false
  };

  renderChildren(props) {
    return React.Children.map(props.children, child => {
      if (!child) return null;
      if (isString(child.type)) {
        return child;
      }
      const { horizontal, label, ...childProps } = this.props;
      return React.cloneElement(child, childProps);
    });
  }

  render() {
    const classes = classNames({
      "form-section": true,
      horizontal: this.props.horizontal
    });

    return (
      <div className={classes} key="group">
        {isString(this.props.label)
          ? <span className="form-section-label">
              {this.props.label}
            </span>
          : null}
        {isString(this.props.instructions)
          ? <span className="instructions">
              {this.props.instructions}
            </span>
          : null}
        {this.renderChildren(this.props)}
      </div>
    );
  }
}
