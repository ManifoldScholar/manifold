import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import isString from "lodash/isString";
import classNames from "classnames";
import Instructions from "./Instructions";

export default class FieldGroup extends PureComponent {
  static propTypes = {
    horizontal: PropTypes.bool,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    label: PropTypes.string
  };

  static defaultProps = {
    horizontal: false,
    instructions: null
  };

  renderChildren(props) {
    return React.Children.map(props.children, child => {
      if (!child) return null;
      if (isString(child.type)) {
        return child;
      }
      const { horizontal, label, instructions, ...childProps } = this.props;
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
        {isString(this.props.label) ? (
          <header className="form-section-label">
            <span>{this.props.label}</span>
          </header>
        ) : null}
        <Instructions instructions={this.props.instructions} />
        {this.renderChildren(this.props)}
      </div>
    );
  }
}
