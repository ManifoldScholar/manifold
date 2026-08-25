import { useState, useId } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "global/components/form";
import List from "./List";
import * as Styled from "./styles";

export default function AllowBlockListInput({
  type,
  value,
  setValue,
  instructionsId
}) {
  const { t } = useTranslation();
  const id = useId();

  const [next, setNext] = useState(null);
  const handleAdd = issuer => {
    setValue([...value, issuer]);
    setNext(null);
  };
  const handleRemove = i => {
    const update = value.toSpliced(i, 1);
    setValue(update);
  };

  return (
    <Styled.Wrapper>
      <Form.Label
        id={id}
        label={t(`settings.lti.${type}_list_label`)}
        styleType="secondary"
      />
      <Form.BaseInput
        id={id}
        type="text"
        idForInstructions={instructionsId}
        placeholder={t(`settings.lti.${type}_list_placeholder`)}
        onChange={e => {
          e.preventDefault();
          setNext(e.target.value);
        }}
        onKeyDown={e => {
          if (e.keyCode === 13) {
            e.preventDefault();
            handleAdd(next);
          }
        }}
        value={next}
        buttons={[
          {
            label: t("actions.add"),
            onClick: () => handleAdd(next)
          }
        ]}
      />
      <List value={value} handleRemove={handleRemove} />
    </Styled.Wrapper>
  );
}

AllowBlockListInput.displayName = "Settings.LTI.AllowBlockListInput";

AllowBlockListInput.propTypes = {
  type: PropTypes.oneOf(["allow", "block"]).isRequired,
  value: PropTypes.array.isRequired,
  setValue: PropTypes.func.isRequired,
  instructionsId: PropTypes.string
};
