import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

function ChildSelectorButton({ active, entity, toggleVisible, ...props }, ref) {
  const { t } = useTranslation();

  return (
    <Styled.Button ref={ref} tabIndex={0} onClick={toggleVisible} {...props}>
      <span>{active ?? t("actions.show_entity", { entity })}</span>
      <Styled.DropdownIcon icon="disclosureDown24" size={22} />
    </Styled.Button>
  );
}

ChildSelectorButton.displayName = "PageHeader.ChildSelector";

export default forwardRef(ChildSelectorButton);
