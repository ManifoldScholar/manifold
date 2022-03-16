import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";
import { withTranslation } from "react-i18next";

class ShareClicks extends Component {
  static displayName = "Analytics.Composed.ShareClicks";

  static propTypes = {
    t: PropTypes.func
  };

  get data() {
    return this.props.data;
  }

  get total() {
    return this.data.reduce((accum, entry) => accum + entry.count, 0);
  }

  get blockWidth() {
    return this.props.width || 25;
  }

  render() {
    return (
      <Block
        width={this.blockWidth}
        icon="share32"
        title={this.props.t("backend.analytics.shares")}
      >
        <Figure
          stat={`${this.total}`}
          caption={this.props.t("backend.analytics.share_clicks")}
        />
      </Block>
    );
  }
}

export default withTranslation()(ShareClicks);
