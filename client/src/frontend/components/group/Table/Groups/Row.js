import React, { Component } from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";
// import Row from "../Base/Row";
// import Cell from "../Base/Cell";

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

  // get oldRow() {
  //   return (
  //     <React.Fragment>
  //       <Cell
  //         hoverIcon={this.hoverIcon}
  //         textStyle={"valueLarge"}
  //       >
  //         {this.modelAttributes.name}
  //       </Cell>
  //       <Cell>
  //         {this.modelAttributes.type}
  //       </Cell>
  //       <Cell>
  //         {this.modelAttributes.role}
  //       </Cell>
  //       <Cell
  //         align={this.alignCenter}
  //         nestedLink={this.nestedLink}
  //       >
  //         {this.modelAttributes.memberCount}
  //       </Cell>
  //       <Cell align={this.alignCenter}>
  //         {this.modelAttributes.annotationCount}
  //       </Cell>
  //       <Cell align={this.alignCenter}>
  //         {this.modelAttributes.highlightCount}
  //       </Cell>
  //     </React.Fragment>
  //   )
  // }

  get cells() {
    return [
      {
        name: "groupName",
        value: this.modelAttributes.name,
        hoverIcon: this.hoverIcon,
        textStyle: "valueLarge"
      },
      {
        name: "groupType",
        value: this.modelAttributes.type
      },
      {
        name: "memberRole",
        value: this.modelAttributes.role
      },
      {
        name: "groupMemberCount",
        value: this.modelAttributes.memberCount,
        nestedLink: this.nestedLink,
        align: this.alignCenter
      },
      {
        name: "groupAnnotationCount",
        value: this.modelAttributes.annotationCount,
        align: this.alignCenter
      },
      {
        name: "groupHighlightCount",
        value: this.modelAttributes.highlightCount,
        align: this.alignCenter
      },
    ]
  }

  render() {
    return this.props.children(this.id, this.cells);
  }
}
