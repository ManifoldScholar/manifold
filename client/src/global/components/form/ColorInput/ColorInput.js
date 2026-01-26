import { useId, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Coloris from "@melloware/coloris";
import setter from "../setter";
import * as Styled from "./styles";

function ColorInput({ defaultValue, container, ...props }) {
  const id = useId();
  const inputRef = useRef();
  const colorRef = useRef(props.value || defaultValue);

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
  }, [inputId, container, props]);

  useEffect(() => {
    const onClose = () => {
      props.onChange({ target: { value: colorRef.current } });
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
  }, [inputRef, defaultValue, colorRef, container, props]);

  return (
    <Styled.ColorInput
      id={inputId}
      colorRef={inputRef}
      idForError={`color-input-error-${id}`}
      idForInstructions={`color-input-instructions-${id}`}
      placeholder={defaultValue}
      {...props}
      $defaultColor={defaultValue}
    />
  );
}

ColorInput.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  // By default the color picker renders as a dialog in <body>.
  // Pass a selector if rendering in a focus trap.
  container: PropTypes.string
  // See BaseInput for remaining propTypes
};

export default setter(ColorInput);

ColorInput.displayName = "Form.ColorInput";
