import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Table from "../parts/Table";
import ProjectRow from "../parts/ProjectRow";
import lh from "helpers/linkHandler";
import { withTranslation } from "react-i18next";

class TopProjects extends Component {
  static displayName = "Analytics.Composed.TopProjects";

  static propTypes = {
    withSort: PropTypes.bool,
    withAllLink: PropTypes.bool,
    data: PropTypes.array,
    pagination: PropTypes.object,
    t: PropTypes.func
  };

  static defaultProps = {
    withSort: false,
    withAllLink: false
  };

  get data() {
    return this.props.data;
  }

  get sortOptions() {
    const { withSort } = this.props;
    if (!withSort) return null;
    return [
      {
        key: "most_visited_desc",
        value: "most_visited_desc",
        label: this.props.t("analytics.most_visited_top")
      },
      {
        key: "most_visited_asc",
        value: "most_visited_asc",
        label: this.props.t("analytics.most_visited_bottom")
      }
    ];
  }

  get blockWidth() {
    return this.props.width || 50;
  }

  render() {
    const { pagination, paginationClickHandler, withAllLink } = this.props;

    return (
      <Block
        width={this.blockWidth}
        icon="eyeOpen32"
        title={this.props.t("analytics.most_viewed_projects")}
      >
        <Table
          rowComponent={ProjectRow}
          headers={[
            this.props.t("glossary.project_title_case_one"),
            this.props.t("analytics.visits")
          ]}
          rows={this.data}
          paginationClickHandler={paginationClickHandler}
          pagination={pagination}
          sortOptions={this.sortOptions}
          allLink={withAllLink ? lh.link("backendAnalyticsTopProjects") : null}
        />
      </Block>
    );
  }
}

export default withTranslation()(TopProjects);
