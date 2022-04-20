import React from "react";
import useCollapseContext from "global/components/Collapse/useCollapseContext";
import { useTranslation } from "react-i18next";

const ToggleText = () => {
  const { visible } = useCollapseContext();
  const { t } = useTranslation();
  return (
    <span>
      {visible ? t("actions.hide_description") : t("actions.read_more")}
    </span>
  );
};

export default ToggleText;
