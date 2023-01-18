import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";
import { withTranslation } from "react-i18next";

class ReturnVisits extends Component {
  static displayName = "Analytics.Composed.ReturnVisits";

  static propTypes = {
    t: PropTypes.func
  };

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
    const totalVisitorCount = this.props.t("analytics.visitor_with_count", {
      count: this.allVisits
    });
    return this.props.t("analytics.return_visit_count", {
      totalVisitorCount,
      returnVisitorCount: this.returnVisits
    });
  }

  render() {
    return (
      <Block
        width={this.blockWidth}
        icon="reload32"
        title={this.props.t("analytics.return_visits")}
      >
        <Figure stat={this.percentage} caption={this.caption} />
      </Block>
    );
  }
}

export default withTranslation()(ReturnVisits);
