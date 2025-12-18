import PropTypes from "prop-types";
import InputError from "../InputError";
import { brackets2dots } from "utils/string";
import has from "lodash/has";
import FieldWrapper from "../FieldWrapper";

const pointerFor = name => {
  const dotNotation = brackets2dots(name);
  const jsonPointer = dotNotation
    .replace(/^attributes\.|^relationships\./, "")
    .replace(".", "/");
  return `/data/attributes/${jsonPointer}`;
};

export default function Errorable({
  errors = [],
  className,
  name,
  children,
  idForError
}) {
  // If name = "*" this component will show all errors, rather than a specific
  // field error.
  const allErrors = () => {
    if (!errors) return [];
    return errors.filter(error => {
      return has(error, "source");
    });
  };

  const fieldErrors = () => {
    if (!errors) return [];
    if (name === "*") return allErrors();
    let names = name;
    let fieldErrorsList = [];
    if (!Array.isArray(names)) {
      names = [name];
    }
    names.forEach(fieldName => {
      const pointer = pointerFor(fieldName);
      const pointerErrors = errors.filter(error => {
        if (!error.hasOwnProperty("source")) return false;
        return error.source.pointer === pointer;
      });
      fieldErrorsList = [...fieldErrorsList, ...pointerErrors];
    });
    return fieldErrorsList;
  };

  const fieldErrorsList = fieldErrors();
  const hasErrors = fieldErrorsList.length > 0;

  return hasErrors || children ? (
    <FieldWrapper className={className}>
      {children}
      {hasErrors ? (
        <InputError errors={fieldErrorsList} idForError={idForError || null} />
      ) : null}
    </FieldWrapper>
  ) : null;
}

Errorable.propTypes = {
  errors: PropTypes.array,
  containerStyle: PropTypes.object,
  className: PropTypes.string,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  nameForError: PropTypes.string,
  idForError: PropTypes.string
};
