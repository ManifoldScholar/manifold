import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Table from "../Base/index";
import GroupRow from "./Row";

export default class GroupsTable extends PureComponent {

  static propTypes = {
    groups: PropTypes.array.isRequired
  }

  get groups() {
    return this.props.groups;
  }

  get pagination() {
    return this.props.pagination;
  }

  render() {
    return(
      <Table
        models={this.groups}
        pagination={this.pagination}
        rowComponent={GroupRow}
      />
    );
  }
}
