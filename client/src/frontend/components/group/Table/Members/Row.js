import React, { Component } from "react";
import PropTypes from "prop-types";
import Cell from "global/components/Table/Cell";
import TableAvatar from "global/components/Table/Avatar";
import RemoveMemberButton from "./RemoveMember";
import NameWithArrow from "global/components/Table/NameWithArrow";

export default class MemberRow extends Component {
  static headers = () => [
    {
      name: "memberAvatar"
    },
    {
      name: "memberName",
      label: "Name",
      cellPadding: "leftSmall"
    },
    {
      name: "memberRole",
      label: "Role"
    },
    {
      name: "memberAnnotationCount",
      label: "Annotations",
      icon: "comment24"
    },
    {
      name: "memberHighlightCount",
      label: "Highlights",
      icon: "annotate24"
    },
    {
      name: "removeMember"
    }
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

  get hideDesktop() {
    return "hideDesktop";
  }

  get hideMobile() {
    return "hideMobile";
  }

  get avatarUrl() {
    if (this.modelAttributes.avatarStyles) {
      return this.modelAttributes.avatarStyles.smallSquare;
    } else return null;
  }

  render() {
    return (
      <React.Fragment>
        <Cell
          index={0}
          viewportVisibility={this.hideMobile}
          cellPadding={"rightUnpadded"}
          align={"right"}
          cellSize={"cellSmall"}
        >
          <TableAvatar avatar={this.avatarUrl} />
        </Cell>
        <Cell
          textStyle={"valueLarge"}
          index={1}
          columnPosition={"all"}
          cellPadding={"leftSmall"}
        >
          <TableAvatar
            avatar={this.avatarUrl}
            viewportVisibility={this.hideDesktop}
          />
          <NameWithArrow name={this.modelAttributes.fullName} />
        </Cell>
        <Cell index={2} columnPosition={"left"} cellSize={"cellMedium"}>
          {this.modelAttributes.role}
        </Cell>
        <Cell align={this.alignCenter} index={3} columnPosition={"right"}>
          {this.modelAttributes.annotationCount}
        </Cell>
        <Cell align={this.alignCenter} index={4} columnPosition={"right"}>
          {this.modelAttributes.highlightCount}
        </Cell>
        <Cell
          index={5}
          columnPosition={"left"}
          rowPosition={3}
          cellSize={"cellMedium"}
        >
          <RemoveMemberButton />
        </Cell>
      </React.Fragment>
    );
  }
}
