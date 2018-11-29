import React, { Component } from "react";
import PropTypes from "prop-types";
import humps from "humps";
import isString from "lodash/isString";

export default class Item extends Component {
  static displayName = "Meta.Item";

  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
  };

  renderValue(children, value) {
    if (!children)
      return (
        <div
          className="meta-value"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      );

    const childEl = isString(this.props.children.type)
      ? this.props.children
      : React.cloneElement(this.props.children);
    return <div className="meta-value">{childEl}</div>;
  }

  renderLabel(label) {
    if (!label) return null;
    return (
      <span className="meta-label">
        {humps.decamelize(this.props.label, { separator: " " })}
      </span>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.renderLabel(this.props.label)}
        {this.renderValue(this.props.children, this.props.value)}
      </React.Fragment>
    );
  }
}
