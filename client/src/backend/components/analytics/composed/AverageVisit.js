import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Time from "../parts/Time";

export default class AverageVisit extends Component {
  static displayName = "Analytics.Composed.AverageVisit";

  static propTypes = {};

  get data() {
    return this.props.data.data;
  }

  get averageTime() {
    return this.data.value || 0;
  }

  get blockWidth() {
    return this.props.width || 25;
  }

  render() {
    return (
      <Block width={this.blockWidth} icon="timerClock32" title="Average Visit">
        <Time time={this.averageTime} />
      </Block>
    );
  }
}
