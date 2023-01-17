import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import List from "../parts/List";
import { withTranslation } from "react-i18next";

class SiteStatistics extends Component {
  static displayName = "Analytics.Composed.SiteStatistics";

  static propTypes = {
    t: PropTypes.func
  };

  get stats() {
    const { data } = this.props;
    if (!data) return {};
    return data.attributes;
  }

  get items() {
    return [
      {
        icon: "projects64",
        label: this.props.t("glossary.project_title_case_other"),
        value: this.stats.totalProjectCount
      },
      {
        icon: "textsBook64",
        label: this.props.t("glossary.text_title_case_other"),
        value: this.stats.totalTextCount
      },
      {
        icon: "BEResourcesBoxes64",
        label: this.props.t("glossary.resource_title_case_other"),
        value: this.stats.totalResourceCount
      },
      {
        icon: "users32",
        label: this.props.t("glossary.user_title_case_other"),
        value: this.stats.totalUserCount
      },
      {
        icon: "interactAnnotate32",
        label: this.props.t("glossary.annotation_title_case_other"),
        value: this.stats.totalAnnotationCount
      },
      {
        icon: "interactComment32",
        label: this.props.t("glossary.comment_title_case_other"),
        value: this.stats.totalCommentCount
      }
    ];
  }

  get blockWidth() {
    return this.props.width || 100;
  }

  render() {
    return (
      <Block
        width={this.blockWidth}
        icon="featureMeasure32"
        title={this.props.t("analytics.site_statistics")}
        description={this.props.t("analytics.installation_activity")}
      >
        <List items={this.items} />
      </Block>
    );
  }
}

export default withTranslation()(SiteStatistics);
