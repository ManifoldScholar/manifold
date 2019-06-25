import React, { Component } from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";
import classNames from "classnames";
import Table from "../Base/index";
import GroupRow from "./Row";

export default class GroupsTable extends Component {

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
    )
  }
}
