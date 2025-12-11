import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";
import { withTranslation } from "react-i18next";

class Highlights extends Component {
  static displayName = "Analytics.Composed.Highlights";

  static propTypes = {
    t: PropTypes.func
  };

  get data() {
    return Array.isArray(this.props.data) ? this.props.data[0] : {};
  }

  get blockWidth() {
    return this.props.width || 25;
  }

  get total() {
    return this.data.highlights;
  }

  get caption() {
    const { rangeInWords } = this.props;
    return rangeInWords
      ? this.props.t("analytics.highlights_in_date_range", {
          dateRange: rangeInWords
        })
      : this.props.t("analytics.highlights_made");
  }

  render() {
    return (
      <Block
        width={this.blockWidth}
        icon="interactHighlight32"
        title={this.props.t("glossary.highlight_title_case_other")}
      >
        <Figure stat={`${this.total}`} caption={this.caption} />
      </Block>
    );
  }
}

export default withTranslation()(Highlights);
