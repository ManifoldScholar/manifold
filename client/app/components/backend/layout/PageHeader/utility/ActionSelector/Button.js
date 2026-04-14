import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

function ActionSelectorButton({ entity, toggleVisible, ...props }, ref) {
  const { t } = useTranslation();

  return (
    <Styled.Button ref={ref} tabIndex={0} onClick={toggleVisible} {...props}>
      <span>{t("actions.actions")}</span>
      <Styled.DropdownIcon icon="disclosureDown24" size={22} />
    </Styled.Button>
  );
}

ActionSelectorButton.displayName = "PageHeader.ActionSelector";

export default forwardRef(ActionSelectorButton);
