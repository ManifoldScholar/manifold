import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";

class AllCollectors extends Component {
  static displayName = "Analytics.Composed.AllCollectors";

  static propTypes = {
    t: PropTypes.func
  };

  get data() {
    return this.props.data;
  }

  get blockWidth() {
    return this.props.width || 25;
  }

  render() {
    return (
      <Block
        width={this.blockWidth}
        icon="starSquircleFilled32"
        title={this.props.t("analytics.all_stars")}
      >
        <Figure
          stat={`${this.data.value}`}
          caption={this.props.t("analytics.total_stars")}
        />
      </Block>
    );
  }
}

export default withTranslation()(AllCollectors);
