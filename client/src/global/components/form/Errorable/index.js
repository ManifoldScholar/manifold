import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import InputError from "../InputError";
import brackets2dots from "brackets2dots";
import has from "lodash/has";
import FieldWrapper from "../FieldWrapper";

export default class Errorable extends PureComponent {
  // If name = "*" this component will show all errors, rather than a specific
  // field error.
  static propTypes = {
    errors: PropTypes.array,
    containerStyle: PropTypes.object,
    className: PropTypes.string,
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    nameForError: PropTypes.string,
    idForError: PropTypes.string
  };

  static defaultProps = {
    containerStyle: {}
  };

  allErrors() {
    if (!this.props.errors) return [];
    return this.props.errors.filter(error => {
      return has(error, "source");
    });
  }

  fieldErrors = () => {
    if (!this.props.errors) return [];
    if (this.props.name === "*") return this.allErrors();
    let names = this.props.name;
    let errors = [];
    if (!Array.isArray(names)) {
      names = [this.props.name];
    }
    names.forEach(name => {
      const pointer = this.pointerFor(name);
      const pointerErrors = this.props.errors.filter(error => {
        if (!error.hasOwnProperty("source")) return false;
        return error.source.pointer === pointer;
      });
      errors = [...errors, ...pointerErrors];
    });
    return errors;
  };

  pointerFor(name) {
    const dotNotation = brackets2dots(name);
    const jsonPointer = dotNotation
      .replace(/^attributes\.|^relationships\./, "")
      .replace(".", "/");
    return `/data/attributes/${jsonPointer}`;
  }

  render() {
    const { children, nameForError, className } = this.props;
    const fieldErrors = this.fieldErrors();
    const hasErrors = fieldErrors.length > 0;

    return hasErrors || children ? (
      <FieldWrapper className={className}>
        {children}
        {hasErrors ? (
          <InputError
            errors={fieldErrors}
            idForError={this.props.idForError ? this.props.idForError : null}
            name={nameForError}
          />
        ) : null}
      </FieldWrapper>
    ) : null;
  }
}
