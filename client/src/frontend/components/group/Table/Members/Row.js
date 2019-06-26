import React, { Component } from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";
import Row from "../Base/Row";
import Cell from "../Base/Cell";

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
    console.log(this.constructor.headers());
    return(
      <Row modelId={this.id}>
        <Cell avatar>
          {this.modelAttributes.avatar}
        </Cell>
        <Cell textStyle={"value-large"}>
          {this.modelAttributes.fullName}
        </Cell>
        <Cell>
          {this.modelAttributes.role}
        </Cell>
        <Cell align={this.alignCenter}>
          {this.modelAttributes.annotationCount}
        </Cell>
        <Cell align={this.alignCenter}>
          {this.modelAttributes.highlightCount}
        </Cell>
        <Cell
          removeUser
          align={this.alignCenter}
        />
      </Row>
    );
  }
}
