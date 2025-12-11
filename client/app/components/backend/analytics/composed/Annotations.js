import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import FigureList from "../parts/FigureList";
import { withTranslation } from "react-i18next";

class Annotations extends Component {
  static displayName = "Analytics.Composed.Annotations";

  static propTypes = {
    t: PropTypes.func
  };

  get data() {
    return Array.isArray(this.props.data) ? this.props.data[0] : {};
  }

  get blockWidth() {
    return this.props.width || 100;
  }

  get totalFigure() {
    const { rangeInWords } = this.props;
    const stat =
      this.data.publicAnnotations +
      this.data.privateAnnotations +
      this.data.readingGroupAnnotations;
    return {
      stat,
      caption: rangeInWords
        ? this.props.t("analytics.annotations_in_date_range", {
            dateRange: rangeInWords
          })
        : this.props.t("analytics.annotations_created")
    };
  }

  get publicFigure() {
    const stat = this.data.publicAnnotations;
    return {
      stat,
      caption: this.props.t("common.public_title_case")
    };
  }

  get privateFigure() {
    const stat = this.data.privateAnnotations;
    return {
      stat,
      caption: this.props.t("common.private_title_case")
    };
  }

  get readingGroupFigure() {
    const stat = this.data.readingGroupAnnotations;
    return {
      stat,
      caption: this.props.t("analytics.in_reading_groups")
    };
  }

  get figures() {
    return [
      this.totalFigure,
      this.publicFigure,
      this.privateFigure,
      this.readingGroupFigure
    ];
  }

  render() {
    return (
      <Block
        width={this.blockWidth}
        icon="annotate32"
        title={this.props.t("glossary.annotation_title_case_other")}
      >
        <FigureList figures={this.figures} />
      </Block>
    );
  }
}

export default withTranslation()(Annotations);
