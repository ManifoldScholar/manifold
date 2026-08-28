import PropTypes from "prop-types";
import InputError from "../InputError";
import { brackets2dots } from "utils/string";
import FieldWrapper from "../FieldWrapper";

const ERROR_GROUP_NAMES = ["*", "attributes[base]"];

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
  idForError,
  idForInput,
  as = "div"
}) {
  const noInput = ERROR_GROUP_NAMES.includes(name);

  const fieldErrors = () => {
    if (!errors) return [];
    // Wildcard renders every error passed in, including ones without a
    // source.pointer (general failures like 500s).
    if (name === "*") return errors;
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

  if (noInput) {
    return (
      <FieldWrapper className={className} as={as}>
        <InputError errors={fieldErrorsList} idForError={idForError || null} />
      </FieldWrapper>
    );
  }

  return children ? (
    <FieldWrapper className={className} as={as}>
      {children}
      <InputError
        errors={fieldErrorsList}
        idForError={idForError || null}
        idForInput={idForInput}
      />
    </FieldWrapper>
  ) : null;
}

Errorable.propTypes = {
  errors: PropTypes.array,
  containerStyle: PropTypes.object,
  className: PropTypes.string,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  idForError: PropTypes.string,
  idForInput: PropTypes.string,
  as: PropTypes.string
};
