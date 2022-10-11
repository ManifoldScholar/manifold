import React, { Component } from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default class FormHeader extends Component {
  static displayName = "Form.Header";

  static propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  render() {
    const Header =
      this.props.styleType === "primary" ? Styled.HeaderPrimary : Styled.Header;

    return (
      <Header>
        <h2 id={this.props.id}>{this.props.label}</h2>
      </Header>
    );
  }
}
