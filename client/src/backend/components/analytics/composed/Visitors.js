import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Chart from "../parts/Chart";
import { withTranslation } from "react-i18next";
import isEqual from "lodash/isEqual";

class Visitors extends Component {
  static displayName = "Analytics.Composed.Visitors";

  static propTypes = {
    t: PropTypes.func
  };

  shouldComponentUpdate(nextProps) {
    if (isEqual(nextProps.data, this.props.data)) return false;
    return true;
  }

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

  get description() {
    const { rangeInWords } = this.props;
    const uniqueVisitorCount = this.total
      ? this.props.t("analytics.unique_visitor_with_count", {
          count: this.total
        })
      : null;
    return this.total !== null ? (
      <p className="analytics-block__description">
        {rangeInWords
          ? this.props.t("analytics.visitors_in_date_range", {
              uniqueVisitorCount,
              dateRange: rangeInWords
            })
          : uniqueVisitorCount}
      </p>
    ) : null;
  }

  render() {
    return (
      <Block
        width={this.blockWidth}
        icon="featureExplore32"
        title={this.props.t("analytics.visitor_title_case_other")}
        description={this.description}
      >
        <Chart data={this.data} tooltipLabel="analytics.visitor_with_count" />
      </Block>
    );
  }
}

export default withTranslation()(Visitors);
