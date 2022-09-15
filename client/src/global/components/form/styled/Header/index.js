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
    return (
      <Styled.Header>
        <h2 id={this.props.id}>{this.props.label}</h2>
      </Styled.Header>
    );
  }
}
