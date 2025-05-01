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
    const title = isMarkdown ? `markdown_${seed(count)}` : inputValue;
    onSubmit({ title, markdownOnly: isMarkdown });
    setInputValue("");
  }

  const buttonLabel = isMarkdown
    ? t("forms.category.add_markdown")
    : t("actions.add");
  const placeholder = isMarkdown
    ? t("forms.category.title_placeholder")
    : t("forms.category.name_placeholder");

  const ButtonComponent = isMarkdown ? Styled.MarkdownButton : Styled.Button;

  return (
    <Styled.CategoryCreator onSubmit={handleSubmit}>
      {!isMarkdown && (
        <Styled.Label htmlFor={uid}>{t("forms.category.create")}</Styled.Label>
      )}
      <Styled.InputWrapper>
        <Styled.Input
          id={uid}
          type="text"
          value={inputValue}
          onChange={({ target: { value } }) => setInputValue(value)}
          placeholder={placeholder}
          required={!isMarkdown}
          hidden={isMarkdown}
        />
        <ButtonComponent type="submit">
          <IconComposer icon="circlePlus32" size={32} />
          <span>{buttonLabel}</span>
        </ButtonComponent>
      </Styled.InputWrapper>
    </Styled.CategoryCreator>
  );
}

CategoryCreator.displayName =
  "ReadingGroup.Collecting.CollectionEditor.CategoryCreator";

CategoryCreator.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isMarkdown: PropTypes.bool,
  count: PropTypes.number,
};

export default CategoryCreator;
