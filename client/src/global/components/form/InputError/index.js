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
    if (this.hasErrors()) {
      return (
        <Styled.ErrorList
          id={this.props.idForError ? this.props.idForError : null}
          role="alert"
          aria-live="polite"
          aria-atomic="true"
          className={this.props.className}
        >
          {this.props.errors.map((e, i) => {
            return <Styled.Error key={i}>{this.errorString(e)}</Styled.Error>;
          })}
        </Styled.ErrorList>
      );
    }
    return null;
  }
}
