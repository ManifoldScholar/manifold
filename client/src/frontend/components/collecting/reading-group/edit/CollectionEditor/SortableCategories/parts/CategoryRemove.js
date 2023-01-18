import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import withConfirmation from "hoc/withConfirmation";
import * as Styled from "./styles";

function CategoryRemove({ onRemove, confirm }) {
  const { t } = useTranslation();

  function handleClick() {
    const heading = t("modals.remove_category");
    const message = t("modals.remove_category_body");
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
