import React, { Component } from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";
import Cell from "../Base/Cell";
import Avatar from "../Base/Avatar";
import RemoveMemberButton from "../Base/RemoveMember";

export default class MemberRow extends Component {

  static headers = ()=> [
        {
          name: "memberAvatar",
        },
        {
          name: "memberName",
          label: "Name"
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
          name: "removeMember",
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

  render() {
    return(
      <React.Fragment>
        <Cell index={0}>
          <Avatar avatar={this.modelAttributes.avatar} />
        </Cell>
        <Cell
          textStyle={"valueLarge"}
          cellPadding={"noLeft"}
          index={1}>
          {this.modelAttributes.fullName}
        </Cell>
        <Cell index={2}>
          {this.modelAttributes.role}
        </Cell>
        <Cell align={this.alignCenter} index={3}>
          {this.modelAttributes.annotationCount}
        </Cell>
        <Cell align={this.alignCenter} index={4}>
          {this.modelAttributes.highlightCount}
        </Cell>
        <Cell align={this.alignCenter} index={5}>
          <RemoveMemberButton />
        </Cell>
      </React.Fragment>
    );
  }
}
