import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";

export default class Highlights extends Component {
  static displayName = "Analytics.Composed.Highlights";

  static propTypes = {};

  get data() {
    return this.props.data.data;
  }

  get blockWidth() {
    return this.props.width || 25;
  }

  get total() {
    return 42;
  }

  render() {
    return (
      <Block
        width={this.blockWidth}
        icon="interactHighlight32"
        title="Highlights"
      >
        <Figure
          stat={`${this.total}`}
          caption="Highlights made in the last 30 days"
        />
      </Block>
    );
  }
}
