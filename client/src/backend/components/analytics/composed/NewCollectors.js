import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";
import { withTranslation } from "react-i18next";

class NewCollectors extends Component {
  static displayName = "Analytics.Composed.NewCollectors";

  static propTypes = {
    t: PropTypes.func
  };

  get data() {
    return this.props.data;
  }

  get blockWidth() {
    return this.props.width || 25;
  }

  get caption() {
    const { rangeInWords } = this.props;
    return rangeInWords
      ? this.props.t("analytics.stars_in_date_range", {
          dateRange: rangeInWords
        })
      : this.props.t("analytics.stars_received");
  }

  render() {
    return (
      <Block
        width={this.blockWidth}
        icon="starSquircle32"
        title={this.props.t("analytics.new_stars")}
      >
        <Figure stat={`${this.data.value}`} caption={this.caption} />
      </Block>
    );
  }
}

export default withTranslation()(NewCollectors);
