import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";
import pluralize from "pluralize";

export default class ReturnVisits extends Component {
  static displayName = "Analytics.Composed.ReturnVisits";

  static propTypes = {};

  get data() {
    return this.props.data;
  }

  get percentage() {
    return parseFloat(this.data.fraction * 100).toFixed(0) + "%";
  }

  get returnVisits() {
    return this.data.numerator;
  }

  get allVisits() {
    return this.data.denominator;
  }

  get blockWidth() {
    return this.props.width || 25;
  }

  get caption() {
    const root = "visitor";
    const label = this.allVisits === 1 ? root : pluralize(root);
    return `${this.returnVisits} of ${this.allVisits} ${label} were making a return visit.`;
  }

  render() {
    return (
      <Block width={this.blockWidth} icon="reload32" title="Return Visits">
        <Figure stat={this.percentage} caption={this.caption} />
      </Block>
    );
  }
}
