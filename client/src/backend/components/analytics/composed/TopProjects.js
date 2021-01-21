import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Table from "../parts/Table";
import ProjectRow from "../parts/ProjectRow";
import lh from "helpers/linkHandler";

export default class TopProjects extends Component {
  static displayName = "Analytics.Composed.TopProjects";

  static propTypes = {
    withSort: PropTypes.bool,
    withAllLink: PropTypes.bool,
    data: PropTypes.array,
    pagination: PropTypes.object
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
        label: "Most visited at the top"
      },
      {
        key: "most_visited_asc",
        value: "most_visited_asc",
        label: "Most visited at the bottom"
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
        title="Most Viewed Projects"
      >
        <Table
          rowComponent={ProjectRow}
          headers={["Project", "Visits"]}
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
