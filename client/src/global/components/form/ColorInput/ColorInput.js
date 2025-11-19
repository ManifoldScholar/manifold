import { useId, useEffect, useRef } from "react";
import Coloris from "@melloware/coloris";
import setter from "../setter";
import * as Styled from "./styles";

function ColorInput({ defaultValue, ...props }) {
  const id = useId();
  const inputRef = useRef();
  const colorRef = useRef(props.value || defaultValue);

  const inputId = `color-input-${id}`;

  useEffect(() => {
    Coloris.init();

    const setColor = event => {
      const isTarget = event.detail.currentEl.id === inputId;
      if (isTarget) colorRef.current = event.detail.color;
    };

    document.addEventListener("coloris:pick", setColor);

    return () => document.removeEventListener("coloris:pick", setColor);
  }, [inputId, props]);

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
        margin: 5
      });

      inputEl.addEventListener("close", onClose);

      return () => inputEl.removeEventListener("close", onClose);
    }
  }, [inputRef, defaultValue, colorRef, props]);

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

export default setter(ColorInput);

ColorInput.displayName = "Form.ColorInput";
