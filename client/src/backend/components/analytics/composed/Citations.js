import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Figure from "../parts/Figure";
import { withTranslation } from "react-i18next";

class Citations extends Component {
  static displayName = "Analytics.Composed.Citations";

  static propTypes = {
    t: PropTypes.func
  };

  get data() {
    return this.props.data;
  }

  get total() {
    return this.props.data.value;
  }

  get blockWidth() {
    return this.props.width || 25;
  }

  render() {
    return (
      <Block
        width={this.blockWidth}
        icon="SocialCite32"
        title={this.props.t("glossary.citation_other")}
      >
        <Figure
          stat={`${this.total}`}
          caption={this.props.t("analytics.citations_generated")}
        />
      </Block>
    );
  }
}

export default withTranslation()(Citations);
