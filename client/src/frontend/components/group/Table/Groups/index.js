import React, { Component } from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";
import classNames from "classnames";
import Table from "../Base/index";

export default class GroupsTable extends Component {

  get groups() {
    return this.props.groups;
  }

  get pagination() {
    return this.props.pagination;
  }

  render() {
    return(
      <Table groups={this.groups} pagination ={this.pagination}/>
    )
  }
}
