import React, { Component } from "react";
import PropTypes from "prop-types";
import Instructions from "../Instructions";
import * as Styled from "./styles";

export default class FormHeader extends Component {
  static displayName = "Form.Header";

  static propTypes = {
    label: PropTypes.node.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    instructions: PropTypes.string
  };

  render() {
    const Header =
      this.props.styleType === "primary" ? Styled.HeaderPrimary : Styled.Header;

    return (
      <Header $hasInstructions={this.props.instructions}>
        <h2 id={this.props.id}>{this.props.label}</h2>
        {this.props.instructions && (
          <Instructions
            instructions={this.props.instructions}
            styleType={this.props.styleType ?? "primary"}
          />
        )}
      </Header>
    );
  }
}
