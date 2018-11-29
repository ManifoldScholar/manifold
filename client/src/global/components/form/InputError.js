import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import has from "lodash/has";
import capitalize from "lodash/capitalize";
import humps from "humps";
import config from "config";

export default class InputError extends Component {
  static propTypes = {
    errors: PropTypes.array,
    name: PropTypes.string,
    idForError: PropTypes.string
  };

  hasErrors = () => {
    return this.props.errors.length > 0;
  };

  nameFromPointer(pointer) {
    const attribute = humps.decamelize(pointer.split("/").pop(), {
      separator: " "
    });
    const lookup = `app.locale.errors.pointers.${pointer}`;
    if (has(config, lookup)) {
      return get(config, lookup);
    }
    return attribute;
  }

  errorString(error) {
    const param = get(error, "source.param");
    const pointer = get(error, "source.pointer");
    const name = this.props.name || param || this.nameFromPointer(pointer);
    return `${capitalize(name)} ${error.detail}.  `;
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
              <span key={i} className="error">
                {this.errorString(e)}
                <br />
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
