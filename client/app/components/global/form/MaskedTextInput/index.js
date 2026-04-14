import { useMemo, useId } from "react";
import PropTypes from "prop-types";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import fill from "lodash/fill";
import isString from "lodash/isString";
import { useFormField } from "hooks";
import Instructions from "../Instructions";
import FieldWrapper from "../FieldWrapper";
import BaseLabel from "../BaseLabel";
import * as Styled from "../BaseInput/styles";

const DEFAULT_PLACEHOLDER_CHAR = "\u005F"; // react-text-mask default "_"
const DOI_PLACEHOLDER_CHAR = "\u2000"; // white-space because we allow "_" in DOI

const currencyMask = () =>
  createNumberMask({
    prefix: "$",
    allowDecimal: true
  });

const hashTagMask = () => raw => {
  // eslint-disable-next-line
  const wordChar = /^#?[^\s!@#$%^&*()=+.\/,[{]};:'"?><]+$/;
  // eslint-disable-next-line
  const notWordChar = /[\s!@#$%^&*()=+.\/,[{]};:'"?><]+/g;
  const adjusted = raw.replace(notWordChar, "").replace("_", "");
  const length = adjusted.length;
  let mask = Array(length);
  mask.unshift("#");
  fill(mask, wordChar, 1);
  if (mask.length === 1) mask = [/#/];
  return mask;
};

const doiMask = () => raw => {
  const base = "https://doi.org/10.".split("");
  const wordChar = /^[A-Za-z0-9_.;()\-/]$/;
  const adjusted = raw.replace(/\s/g, "");
  const length = adjusted.length;
  let mask =
    length >= base.length ? Array(length - base.length) : Array(length);
  mask.unshift(...base);
  fill(mask, wordChar, base.length);
  if (mask.length === base.length) mask = base;
  return mask;
};

export default function FormMaskedTextInput({
  name,
  mask: maskProp,
  placeholder,
  label,
  instructions,
  onClick,
  wide,
  autoComplete = "off"
}) {
  const id = useId();
  const { value, onChange } = useFormField(name);

  const { mask, placeholderChar } = useMemo(() => {
    switch (maskProp) {
      case "currency":
        return {
          mask: currencyMask(),
          placeholderChar: DEFAULT_PLACEHOLDER_CHAR
        };
      case "hashtag":
        return {
          mask: hashTagMask(),
          placeholderChar: DEFAULT_PLACEHOLDER_CHAR
        };
      case "doi":
        return { mask: doiMask(), placeholderChar: DOI_PLACEHOLDER_CHAR };
      default:
        return { mask: maskProp, placeholderChar: DEFAULT_PLACEHOLDER_CHAR };
    }
  }, [maskProp]);

  return (
    <FieldWrapper className={wide ? "wide" : undefined}>
      <BaseLabel
        id={`masked-text-${id}`}
        hasInstructions={isString(instructions)}
        label={label}
      />
      <Styled.SecondaryInput
        as={MaskedInput}
        onChange={onChange}
        value={value}
        id={`masked-text-${id}`}
        type="text"
        mask={mask}
        placeholder={placeholder}
        placeholderChar={placeholderChar}
        onClick={onClick}
        aria-describedby={`masked-text-instructions-${id}`}
        autoComplete={autoComplete}
      />
      <Instructions
        instructions={instructions}
        id={`masked-text-instructions-${id}`}
      />
    </FieldWrapper>
  );
}

FormMaskedTextInput.displayName = "Form.MaskedTextInput";

FormMaskedTextInput.propTypes = {
  name: PropTypes.string.isRequired,
  mask: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onClick: PropTypes.func,
  wide: PropTypes.bool,
  autoComplete: PropTypes.string
};
