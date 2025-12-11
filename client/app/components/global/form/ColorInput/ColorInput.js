import { useId, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Coloris from "@melloware/coloris";
import { useFormField } from "hooks";
import * as Styled from "./styles";

export default function ColorInput({
  name,
  defaultValue,
  container,
  ...props
}) {
  const id = useId();
  const inputRef = useRef();
  const { value, set } = useFormField(name);
  const colorRef = useRef(value || defaultValue);

  const inputId = `color-input-${id}`;

  useEffect(() => {
    Coloris.init({ parent: container });

    const setColor = event => {
      const isTarget = event.detail.currentEl.id === inputId;
      if (isTarget) colorRef.current = event.detail.color;
    };

    document.addEventListener("coloris:pick", setColor);

    const handleEnter = e => {
      if (e.key !== "Enter") return;
      e.preventDefault();
    };

    const picker = document.querySelector("#clr-picker");
    picker.addEventListener("keydown", handleEnter);

    return () => {
      document.removeEventListener("coloris:pick", setColor);
      picker.removeEventListener("keydown", handleEnter);
    };
  }, [inputId, container]);

  useEffect(() => {
    const onClose = () => {
      set(colorRef.current);
    };

    const inputEl = inputRef.current;

    if (inputEl) {
      Coloris({
        el: inputEl,
        format: "mixed",
        formatToggle: true,
        themeMode: "dark",
        clearButton: true,
        defaultColor: defaultValue,
        margin: 5,
        parent: container
      });

      inputEl.addEventListener("close", onClose);

      return () => inputEl.removeEventListener("close", onClose);
    }
  }, [defaultValue, container, set]);

  return (
    <Styled.ColorInput
      id={inputId}
      name={name}
      colorRef={inputRef}
      idForError={`color-input-error-${id}`}
      idForInstructions={`color-input-instructions-${id}`}
      placeholder={defaultValue}
      {...props}
      $defaultColor={defaultValue}
    />
  );
}

ColorInput.displayName = "Form.ColorInput";

ColorInput.propTypes = {
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string.isRequired,
  container: PropTypes.string
};
