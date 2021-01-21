import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";

export default class NewFollowers extends Component {
  static displayName = "Analytics.Composed.NewFollowers";

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
      ? `New project followers in ${rangeInWords}.`
      : "New project followers";
  }

  render() {
    return (
      <Block
        width={this.blockWidth}
        icon="starSquircle32"
        title="New Followers"
      >
        <Figure stat={`${this.data.value}`} caption={this.caption} />
      </Block>
    );
  }
}
