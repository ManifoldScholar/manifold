import { useId } from "react";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import { ICON_MAP } from "lti/components/Cart/Group/index";
import * as Styled from "./styles";

export default function FilterToggle({
  name,
  value,
  checked,
  onChange,
  disabled,
  type
}) {
  const id = useId();
  const { t } = useTranslation();

  return (
    <label htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className="screen-reader-text"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <Styled.Toggle>
        <Styled.Circle>
          <IconComposer icon="checkCircle16" size={18} />
        </Styled.Circle>
        <IconComposer icon={ICON_MAP[type]} size={20} />
        <Styled.Label>{t(`lti.types_plural.${type}`)}</Styled.Label>
      </Styled.Toggle>
    </label>
  );
}
