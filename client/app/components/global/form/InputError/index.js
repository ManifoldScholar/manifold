import PropTypes from "prop-types";
import { capitalize } from "lodash-es";
import * as Styled from "./styles";

const errorString = error => {
  if (typeof error.detail === "object") return error.detail;
  if (error.detail.split(".").length > 1) {
    return error.detail;
  }
  const out = `${capitalize(error.detail)}`;
  if (out.endsWith(".") || out.endsWith("?")) return out;
  return `${out}.`;
};

export default function InputError({
  errors = [],
  idForError,
  idForInput,
  className
}) {
  const hasErrors = errors.length > 0;

  return (
    <Styled.ErrorList
      id={idForError || null}
      htmlFor={idForInput}
      role="status"
      className={hasErrors ? className : "screen-reader-text"}
    >
      {hasErrors
        ? errors.map(e => {
            return <Styled.Error key={e}>{errorString(e)}</Styled.Error>;
          })
        : null}
    </Styled.ErrorList>
  );
}

InputError.propTypes = {
  errors: PropTypes.array,
  idForError: PropTypes.string,
  idForInput: PropTypes.string,
  className: PropTypes.string
};
