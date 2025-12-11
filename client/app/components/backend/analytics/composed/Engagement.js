import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";
import { withTranslation } from "react-i18next";

class Engagement extends Component {
  static displayName = "Analytics.Composed.Engagement";

  static propTypes = {
    t: PropTypes.func
  };

  get data() {
    return this.props.data;
  }

  get percentage() {
    return parseFloat(this.data.fraction * 100).toFixed(0) + "%";
  }

  get activeVisitorCount() {
    return this.data.numerator;
  }

  get visitorCount() {
    return this.data.denominator;
  }

  get blockWidth() {
    return this.props.width || 25;
  }

  get caption() {
    const visitorCount = this.props.t("analytics.visitor_with_count", {
      count: this.activeVisitorCount
    });
    return this.props.t("analytics.visitor_engagement", {
      visitorCount
    });
  }

  render() {
    return (
      <Block
        width={this.blockWidth}
        icon="resourceInteractive64"
        title={this.props.t("analytics.engagement")}
      >
        <Figure stat={this.percentage} caption={this.caption} />
      </Block>
    );
  }
}

export default withTranslation()(Engagement);
