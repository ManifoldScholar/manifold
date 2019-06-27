import React, { Component } from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";
import Cell from "../Base/Cell";
import NestedLink from "../Base/NestedLink";


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

  get groupMembersLink() {
    return "/test"
  }

  render() {
    return (
      <React.Fragment>
        <Cell
          index={0}
          hoverIcon={this.hoverIcon}
          textStyle={"valueLarge"}
          column={"all"}
        >
          {this.modelAttributes.name}
        </Cell>
        <Cell
          index={1}
          column={"left"}
        >
          {this.modelAttributes.type}
        </Cell>
        <Cell
          index={2}
          column={"left"}
        >
          {this.modelAttributes.role}
        </Cell>
        <Cell
          index={3}
          align={this.alignCenter}
          column={"right"}
          row={2}
        >
          <NestedLink link={this.groupMembersLink}>
            {this.modelAttributes.memberCount}
          </NestedLink>
        </Cell>
        <Cell
          index={4}
          align={this.alignCenter}
          column={"right"}
        >
          {this.modelAttributes.annotationCount}
        </Cell>
        <Cell
          index={5}
          align={this.alignCenter}
          column={"right"}
        >
          {this.modelAttributes.highlightCount}
        </Cell>
      </React.Fragment>
    )
  }
}
