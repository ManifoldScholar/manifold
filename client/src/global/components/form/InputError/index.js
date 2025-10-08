import React, { Component } from "react";
import PropTypes from "prop-types";
import capitalize from "lodash/capitalize";
import * as Styled from "./styles";

export default class InputError extends Component {
  static propTypes = {
    errors: PropTypes.array,
    name: PropTypes.string,
    idForError: PropTypes.string,
    className: PropTypes.string
  };

  hasErrors = () => {
    return this.props.errors.length > 0;
  };

  errorString(error) {
    if (error.detail.split(".").length > 1) {
      return error.detail;
    }
    const out = `${capitalize(error.detail)}`;
    if (out.endsWith(".") || out.endsWith("?")) return out;
    return `${out}.`;
  }

  /* eslint-disable react/no-array-index-key */
  render() {
    return (
      <Styled.ErrorList
        id={this.props.idForError ? this.props.idForError : null}
        className={this.props.className}
      >
        {this.hasErrors()
          ? this.props.errors.map((e, i) => {
              return <Styled.Error key={i}>{this.errorString(e)}</Styled.Error>;
            })
          : null}
      </Styled.ErrorList>
    );
  }
}
