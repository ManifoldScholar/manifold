import React, { Component } from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";
import Row from "../Base/Row";
import Cell from "../Base/Cell";

export default class MemberRow extends Component {

  static headers = ()=> {
    [
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
      ]
  }

  get model() {
    return this.props.model;
  }

  get id() {
    return this.model.id;
  }

  get cells() {
    return [
      {
        name: "avatar",
        value: this.model.avatar,
        customCell: "avatar"
      },
      {
        name: "memberName",
        value: this.model.name,
      },
      {
        name: "memberRole",
        value: this.model.role
      },
      {}
    ]
  }

  get cellModel() {
    return (
      <Row className="my-custom-row">
        <Cell>

        </Cell>
        <Cell>

        </Cell>
        <Cell align="center">

        </Cell>
      </Row>
    )
  }


  render() {


    return this.props.children(this.id, this.columns);
  }
}
