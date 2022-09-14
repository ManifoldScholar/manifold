import React, { Component } from "react";
import PropTypes from "prop-types";
import capitalize from "lodash/capitalize";

export default class InputError extends Component {
  static propTypes = {
    errors: PropTypes.array,
    name: PropTypes.string,
    idForError: PropTypes.string
  };

  hasErrors = () => {
    return this.props.errors.length > 0;
  };

  errorString(error) {
    const out = `${capitalize(error.detail)}`;
    if (out.endsWith(".") || out.endsWith("?")) return out;
    return `${out}.`;
  }

  /* eslint-disable react/no-array-index-key */
  render() {
    if (this.hasErrors()) {
      return (
        <span
          id={this.props.idForError ? this.props.idForError : null}
          className="errors"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          {this.props.errors.map((e, i) => {
            return (
              <span key={i}>
                <span className="error">
                  {this.errorString(e)}
                  <br />
                </span>{" "}
              </span>
            );
          })}
        </span>
      );
    }
    return null;
  }
  /* eslint-enable react/no-array-index-key */
}
