import React, { Component } from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";
import Row from "../Base/Row";
import Cell from "../Base/Cell";

export default class GroupRow extends React.PureComponent {

  static headers = () => [
      {
        name: "groupName",
        label: "Name",
      },
      {
        name: "groupType",
        label: "Type"
      },
      {
        name: "userRole",
        label: "Role"
      },
      {
        name: "groupMemberCount",
        label: "Members",
        icon: "avatar24"
      },
      {
        name: "groupAnnotationCount",
        label: "Annotations",
        icon: "comment24"
      },
      {
        name: "groupHighlightCount",
        label: "Highlights",
        icon: "annotate24"
      },
    ];

  get model() {
    return this.props.model;
  }

  get id() {
    return this.model.id;
  }

  render() {
    return this.props.children(this.id);
  }
}
