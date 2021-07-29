import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";
import round from "lodash/round";

export default class Followed extends Component {
  static displayName = "Analytics.Composed.Followed";

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
      <Block width={this.blockWidth} icon="starSquircle32" title="Followed">
        <Figure
          stat={`${this.data.value || 0}`}
          caption="Average number of projects your users are following."
        />
      </Block>
    );
  }
}
