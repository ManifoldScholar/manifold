import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";

export default class AllFollowers extends Component {
  static displayName = "Analytics.Composed.AllFollowers";

  static propTypes = {};

  get data() {
    return this.props.data;
  }

  get blockWidth() {
    return this.props.width || 25;
  }

  render() {
    return (
      <Block
        width={this.blockWidth}
        icon="starSquircleFilled32"
        title="All Followers"
      >
        <Figure
          stat={`${this.data.value}`}
          caption="Total number of project followers."
        />
      </Block>
    );
  }
}
