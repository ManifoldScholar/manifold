import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";
import round from "lodash/round";

export default class Collected extends Component {
  static displayName = "Analytics.Composed.Collected";

  static propTypes = {};

  get data() {
    return this.props.data;
  }

  get value() {
    if (!this.data.value) return 0;
    return round(this.data.value, 2);
  }

  get blockWidth() {
    return this.props.width || 25;
  }

  render() {
    return (
      <Block width={this.blockWidth} icon="starSquircle32" title="Starred">
        <Figure
          stat={`${this.value || 0}`}
          caption="Average number of projects your users have starred."
        />
      </Block>
    );
  }
}
