import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Chart from "../parts/Chart";
import pluralize from "pluralize";

export default class Visitors extends Component {
  static displayName = "Analytics.Composed.Visitors";

  static propTypes = {};

  get total() {
    const { additionalData } = this.props;
    if (!additionalData) return null;
    return additionalData.value;
  }

  get data() {
    return this.props.data || [];
  }

  get blockWidth() {
    return this.props.width || 100;
  }

  get labelRoot() {
    return "visitor";
  }

  get description() {
    const { rangeInWords } = this.props;
    const label = this.total === 1 ? this.labelRoot : pluralize(this.labelRoot);
    return this.total !== null ? (
      <p className="analytics-block__description">
        <span style={{ color: "var(--analytics-highlight-color" }}>
          {this.total}
        </span>{" "}
        {rangeInWords && `unique ${label} in ${rangeInWords}.`}
      </p>
    ) : null;
  }

  render() {
    return (
      <Block
        width={this.blockWidth}
        icon="featureExplore32"
        title="Visitors"
        description={this.description}
      >
        <Chart data={this.data} tooltipLabel={this.labelRoot} />
      </Block>
    );
  }
}
