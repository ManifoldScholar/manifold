import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";
import round from "lodash/round";
import { withTranslation } from "react-i18next";

class Collected extends Component {
  static displayName = "Analytics.Composed.Collected";

  static propTypes = {
    t: PropTypes.func
  };

  get data() {
    return this.props.data;
  }

  get value() {
    if (!this.data.value) return 0;
    return round(this.data.value, 2);
  }

  get blockWidth() {
    return this.props.width || 25;
  }

  render() {
    return (
      <Block
        width={this.blockWidth}
        icon="starSquircle32"
        title={this.props.t("analytics.starred")}
      >
        <Figure
          stat={`${this.value || 0}`}
          caption={this.props.t("analytics.average_projects_starred")}
        />
      </Block>
    );
  }
}

export default withTranslation()(Collected);
