import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";
import pluralize from "pluralize";

export default class Interactions extends Component {
  static displayName = "Analytics.Composed.Interactions";

  static propTypes = {};

  get data() {
    return this.props.data.data;
  }

  get percentage() {
    return parseFloat(this.data.fraction * 100).toFixed(1) + "%";
  }

  get activeVisitorCount() {
    return this.data.numerator;
  }

  get visitorCount() {
    return this.data.denominator;
  }

  get blockWidth() {
    return this.props.width || 25;
  }

  get caption() {
    const root = "visitor";
    const label = this.activeVisitorCount === 1 ? root : pluralize(root);
    return `${this.activeVisitorCount} ${label} used annotations or comments.`;
  }

  render() {
    return (
      <Block
        width={this.blockWidth}
        icon="resourceInteractive64"
        title="Interaction"
      >
        <Figure stat={this.percentage} caption={this.caption} />
      </Block>
    );
  }
}
