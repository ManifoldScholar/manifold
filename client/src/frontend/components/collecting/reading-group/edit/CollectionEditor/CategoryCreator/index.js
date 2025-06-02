import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useUID, useUIDSeed } from "react-uid";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

function CategoryCreator({ onSubmit, isMarkdown, count }) {
  const { t } = useTranslation();

  const uid = useUID();
  const seed = useUIDSeed();

  const [inputValue, setInputValue] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const title = inputValue || `markdown_${seed(count)}`;
    onSubmit({ title, markdownOnly: isMarkdown });
    setInputValue("");
  }

  const createLabel = isMarkdown
    ? t("forms.category.add_markdown")
    : t("forms.category.create");
  const placeholder = isMarkdown
    ? t("forms.category.title_placeholder")
    : t("forms.category.name_placeholder");

  return (
    <Styled.CategoryCreator onSubmit={handleSubmit}>
      <Styled.Label htmlFor={uid}>{createLabel}</Styled.Label>
      <Styled.InputWrapper>
        <Styled.Input
          id={uid}
          type="text"
          value={inputValue}
          onChange={({ target: { value } }) => setInputValue(value)}
          placeholder={placeholder}
          required={!isMarkdown}
        />
        <Styled.Button type="submit">
          <IconComposer icon="circlePlus32" size={32} />
          <span>{t("actions.add")}</span>
        </Styled.Button>
      </Styled.InputWrapper>
    </Styled.CategoryCreator>
  );
}

CategoryCreator.displayName =
  "ReadingGroup.Collecting.CollectionEditor.CategoryCreator";

CategoryCreator.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isMarkdown: PropTypes.bool,
  count: PropTypes.number
};

export default CategoryCreator;
