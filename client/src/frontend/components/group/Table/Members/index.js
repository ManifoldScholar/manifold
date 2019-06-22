import React, { Component } from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";
import classNames from "classnames";
import Table from "../Base/index";

export default class MembersTable extends Component {

  get members() {
    return this.props.members;
  }

  get pagination() {
    return this.props.pagination;
  }

  render() {
    return(
      <Table groups={this.members} pagination ={this.pagination}/>
    )
  }
}
