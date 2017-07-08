import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import isString from "lodash/isString";

export default class FieldGroup extends PureComponent {
  renderChildren(props) {
    return React.Children.map(props.children, child => {
      if (!child) return null;
      if (isString(child.type)) {
        return child;
      }
      return React.cloneElement(child, this.props);
    });
  }

  render() {
    return (
      <div key="group">
        {this.renderChildren(this.props)}
      </div>
    );
  }
}
