import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import withConfirmation from "hoc/withConfirmation";
import * as Styled from "./styles";

function CategoryRemove({ onRemove, confirm, isMarkdown }) {
  const { t } = useTranslation();

  function handleClick() {
    const heading = isMarkdown
      ? t("modals.remove_markdown_block")
      : t("modals.remove_category");
    const message = isMarkdown
      ? t("modals.confirm_body")
      : t("modals.remove_category_body");
    confirm(heading, message, () => onRemove());
  }

  return (
    <Styled.Button onClick={handleClick}>
      <IconComposer icon="delete32" size="default" />
      <span className="screen-reader-text">{t("forms.category.delete")}</span>
    </Styled.Button>
  );
}

CategoryRemove.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.Remove";

CategoryRemove.propTypes = {
  onRemove: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired
};

export default withConfirmation(CategoryRemove);
