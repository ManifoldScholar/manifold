import React, { Component } from "react";
import PropTypes from "prop-types";
import humps from "humps";
import isString from "lodash/isString";
import * as Styled from "./styles";

export default class Item extends Component {
  static displayName = "Meta.Item";

  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
  };

  renderValue(children, value) {
    if (!children)
      return <Styled.Value dangerouslySetInnerHTML={{ __html: value }} />;

    const childEl = isString(this.props.children.type)
      ? this.props.children
      : React.cloneElement(this.props.children);
    return <Styled.Value>{childEl}</Styled.Value>;
  }

  renderLabel(label) {
    if (!label) return null;
    return (
      <Styled.Label>
        {humps.decamelize(this.props.label, { separator: " " })}
      </Styled.Label>
    );
  }

  render() {
    return (
      <>
        {this.renderLabel(this.props.label)}
        {this.renderValue(this.props.children, this.props.value)}
      </>
    );
  }
}
