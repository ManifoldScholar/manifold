import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";

export default class Citations extends Component {
  static displayName = "Analytics.Composed.Citations";

  static propTypes = {};

  get data() {
    return this.props.data;
  }

  get total() {
    return this.props.data.value;
  }

  get blockWidth() {
    return this.props.width || 25;
  }

  render() {
    return (
      <Block width={this.blockWidth} icon="SocialCite32" title="citations">
        <Figure stat={`${this.total}`} caption="Citations generated" />
      </Block>
    );
  }
}
