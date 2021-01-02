import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Chart from "../parts/Chart";
import pluralize from "pluralize";

export default class Visitors extends Component {
  static displayName = "Analytics.Composed.Visitors";

  static propTypes = {};

  get total() {
    return this.data.reduce(
      (accumulator, current) => accumulator + current.y,
      0
    );
  }

  get data() {
    return this.props.data.data || [];
  }

  get blockWidth() {
    return this.props.width || 100;
  }

  render() {
    const labelRoot = "visitor";
    const label = this.total === 1 ? labelRoot : pluralize(labelRoot);

    const description = (
      <p className="analytics-block__description">
        <span style={{ color: "var(--analytics-highlight-color" }}>
          {this.total}
        </span>{" "}
        unique {label} in the last 30 days
      </p>
    );

    return (
      <Block
        width={this.blockWidth}
        icon="featureExplore32"
        title="Visitors"
        description={description}
      >
        <Chart data={this.data} dataLabel={label} />
      </Block>
    );
  }
}
