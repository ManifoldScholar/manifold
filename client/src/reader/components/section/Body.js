import React from "react";
import { Component } from "react";
import PropTypes from "prop-types";
import BodyNodes from "./body-nodes";

export default class Body extends Component {
  static propTypes = {
    section: PropTypes.object,
    annotations: PropTypes.array,
    pendingAnnotation: PropTypes.object,
    location: PropTypes.object
  };

  shouldComponentUpdate(nextProps, nextStateIgnored) {
    const same =
      this.props.section.attributes.bodyJSON ===
        nextProps.section.attributes.bodyJSON &&
      this.props.annotations === nextProps.annotations &&
      this.props.pendingAnnotation === nextProps.pendingAnnotation &&
      this.props.location.key === nextProps.location.key;
    return !same;
  }

  render() {
    const iterator = new BodyNodes.Helpers.NodeTreeIterator(this.props);
    const node = this.props.section.attributes.bodyJSON;
    const elements = iterator.visit(node);
    return elements;
  }
}
