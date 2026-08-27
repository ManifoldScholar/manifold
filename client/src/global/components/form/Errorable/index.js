import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import InputError from "../InputError";
import { brackets2dots } from "utils/string";
import has from "lodash/has";
import FieldWrapper from "../FieldWrapper";

// We could just conditionally render based on children, but it seems better
// to enforce an explicit list of cases where errors can rendered unbound
// to an input
const ERROR_GROUP_NAMES = ["*", "attributes[base]"];

export default class Errorable extends PureComponent {
  // If name = "*" this component will show all errors, rather than a specific
  // field error.
  static propTypes = {
    errors: PropTypes.array,
    containerStyle: PropTypes.object,
    className: PropTypes.string,
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    idForError: PropTypes.string,
    idForInput: PropTypes.string,
    as: PropTypes.string
  };

  static defaultProps = {
    containerStyle: {}
  };

  get noInput() {
    return ERROR_GROUP_NAMES.includes(this.props.name);
  }

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
    const { children, className, as = "div" } = this.props;
    const fieldErrors = this.fieldErrors();

    if (this.noInput) {
      return (
        <FieldWrapper className={className} as={as}>
          <InputError errors={fieldErrors} />
        </FieldWrapper>
      );
    }

    return children ? (
      <FieldWrapper className={className} as={as}>
        {children}
        <InputError
          errors={fieldErrors}
          idForError={this.props.idForError ? this.props.idForError : null}
          idForInput={this.props.idForInput}
        />
      </FieldWrapper>
    ) : null;
  }
}
