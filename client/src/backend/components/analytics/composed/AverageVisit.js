import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Time from "../parts/Time";
import { withTranslation } from "react-i18next";

class AverageVisit extends Component {
  static displayName = "Analytics.Composed.AverageVisit";

  static propTypes = {
    t: PropTypes.func
  };

  get data() {
    return this.props.data;
  }

  get averageTime() {
    return this.data.value || 0;
  }

  get blockWidth() {
    return this.props.width || 25;
  }

  render() {
    return (
      <Block
        width={this.blockWidth}
        icon="timerClock32"
        title={this.props.t("analytics.average_visit")}
      >
        <Time time={this.averageTime} />
      </Block>
    );
  }
}

export default withTranslation()(AverageVisit);
