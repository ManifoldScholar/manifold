import React, { Component } from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";
// import Row from "../Base/Row";
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

  get modelAttributes() {
    return this.model.attributes;
  }

  get id() {
    return this.model.id;
  }

  get alignCenter() {
    return "center";
  }

  get hoverIcon() {
    return "arrow";
  }

  get nestedLink() {
    return "/test"
  }


  render() {
    return (
      <React.Fragment>
        <Cell
          index={0}
          hoverIcon={this.hoverIcon}
          textStyle={"valueLarge"}
        >
          {this.modelAttributes.name}
        </Cell>
        <Cell
          index={1}
        >
          {this.modelAttributes.type}
        </Cell>
        <Cell
          index={2}
        >
          {this.modelAttributes.role}
        </Cell>
        <Cell
          index={3}
          align={this.alignCenter}
          nestedLink={this.nestedLink}
        >
          {this.modelAttributes.memberCount}
        </Cell>
        <Cell
          index={4}
          align={this.alignCenter}
        >
          {this.modelAttributes.annotationCount}
        </Cell>
        <Cell
          index={5}
          align={this.alignCenter}
        >
          {this.modelAttributes.highlightCount}
        </Cell>
      </React.Fragment>
    )
  }
}
