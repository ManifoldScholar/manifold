import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import Table from "../parts/Table";
import ProjectRow from "../parts/ProjectRow";

export default class TopProjects extends Component {
  static displayName = "Analytics.Composed.TopProjects";

  static propTypes = {
    withSort: PropTypes.bool,
    data: PropTypes.shape({
      data: PropTypes.array
    })
  };

  static defaultProps = {
    withSort: false
  };

  get data() {
    return this.props.data.data;
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
    return (
      <Block
        width={this.blockWidth}
        icon="eyeOpen32"
        title="Most Viewed Projects"
      >
        <Table
          rowComponent={ProjectRow}
          paginationClickHandler={() => {}}
          headers={["Project", "Visits"]}
          rows={this.data}
          sortOptions={this.sortOptions}
        />
      </Block>
    );
  }
}
