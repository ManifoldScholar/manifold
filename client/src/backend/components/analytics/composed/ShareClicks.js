import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";

export default class ShareClicks extends Component {
  static displayName = "Analytics.Composed.ShareClicks";

  static propTypes = {};

  get data() {
    return this.props.data.data;
  }

  get total() {
    return this.data.reduce((accum, entry) => accum + entry.count, 0);
  }

  get blockWidth() {
    return this.props.width || 25;
  }

  render() {
    return (
      <Block width={this.blockWidth} icon="share32" title="Shares">
        <Figure stat={`${this.total}`} caption="Shares sent" />
      </Block>
    );
  }
}
