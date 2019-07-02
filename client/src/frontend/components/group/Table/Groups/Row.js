import React, { Component } from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";
import Cell from "global/components/table/Cell";
import NestedLink from "global/components/table/NestedLink";
import NameWithArrow from "global/components/table/NameWithArrow";

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

  get cellMedium() {
    return "cellMedium";
  }

  get hoverIcon() {
    return "arrow";
  }

  get groupMembersLink() {
    return "/test"
  }

  get lockIconClassNames() {
    return "table__private-icon";
  }

  render() {
    return (
      <React.Fragment>
        <Cell
          index={0}
          textStyle={"valueLarge"}
          columnPosition={"all"}
        >
          <NameWithArrow name={this.modelAttributes.name} />
        </Cell>
        <Cell
          index={1}
          columnPosition={"left"}
          cellSize={this.cellMedium}
        >
          {this.modelAttributes.type}
          {this.modelAttributes.type === "private" &&
            <Utility.IconComposer
              icon="lock16"
              size={16}
              iconClass={this.lockIconClassNames}
            />
          }
        </Cell>
        <Cell
          index={2}
          columnPosition={"left"}
          cellSize={this.cellMedium}
        >
          {this.modelAttributes.role}
        </Cell>
        <Cell
          index={3}
          align={this.alignCenter}
          columnPosition={"right"}
          rowPosition={2}
        >
          <NestedLink link={this.groupMembersLink}>
            {this.modelAttributes.memberCount}
          </NestedLink>
        </Cell>
        <Cell
          index={4}
          align={this.alignCenter}
          columnPosition={"right"}
        >
          {this.modelAttributes.annotationCount}
        </Cell>
        <Cell
          index={5}
          align={this.alignCenter}
          columnPosition={"right"}
        >
          {this.modelAttributes.highlightCount}
        </Cell>
      </React.Fragment>
    )
  }
}
