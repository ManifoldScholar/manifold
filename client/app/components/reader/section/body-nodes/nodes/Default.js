import React, { Component } from "react";
import PropTypes from "prop-types";
import validatedNode from "../higher-order/ValidatedNode";

class DefaultNode extends Component {
  static propTypes = {
    attributes: PropTypes.object,
    tag: PropTypes.string,
    children: PropTypes.array
  };

  render() {
    return React.createElement(
      this.props.tag,
      this.props.attributes,
      this.props.children
    );
  }
}

export default validatedNode(DefaultNode);
