import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";

export default class Highlights extends Component {
  static displayName = "Analytics.Composed.Highlights";

  static propTypes = {};

  get data() {
    return this.props.data ? this.props.data[0] : {};
  }

  get blockWidth() {
    return this.props.width || 25;
  }

  get total() {
    return this.data.highlights;
  }

  get caption() {
    const { rangeInWords } = this.props;
    return rangeInWords
      ? `Highlights made in ${rangeInWords}.`
      : "Highlights made";
  }

  render() {
    return (
      <Block
        width={this.blockWidth}
        icon="interactHighlight32"
        title="Highlights"
      >
        <Figure stat={`${this.total}`} caption={this.caption} />
      </Block>
    );
  }
}
