import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";

export default class NewCollectors extends Component {
  static displayName = "Analytics.Composed.NewCollectors";

  static propTypes = {};

  get data() {
    return this.props.data;
  }

  get blockWidth() {
    return this.props.width || 25;
  }

  get caption() {
    const { rangeInWords } = this.props;
    return rangeInWords
      ? `New stars project has received in ${rangeInWords}.`
      : "New stars project has received";
  }

  render() {
    return (
      <Block width={this.blockWidth} icon="starSquircle32" title="New Stars">
        <Figure stat={`${this.data.value}`} caption={this.caption} />
      </Block>
    );
  }
}
