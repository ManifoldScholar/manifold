import React, { Component } from "react";
import PropTypes from "prop-types";
import Table from "../Base/index";
import MemberRow from "./Row";

export default class MembersTable extends Component {

  get members() {
    return this.props.members;
  }

  get pagination() {
    return this.props.pagination;
  }


  render() {
    return(
      <Table
        model={this.members}
        pagination ={this.pagination}
        headers={MemberRow.headers()}
        rowComponent={MemberRow}
      />
    )
  }
}
