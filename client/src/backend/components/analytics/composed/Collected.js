import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";

export default class Collected extends Component {
  static displayName = "Analytics.Composed.Collected";

  static propTypes = {};

  get data() {
    return this.props.data;
  }

  get blockWidth() {
    return this.props.width || 25;
  }

  render() {
    return (
      <Block width={this.blockWidth} icon="starSquircle32" title="Starred">
        <Figure
          stat={`${this.data.value || 0}`}
          caption="Average number of projects your users are starring."
        />
      </Block>
    );
  }
}
