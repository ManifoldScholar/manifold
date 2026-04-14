import { useContext } from "react";
import { CollapseContext } from "helpers/contexts";
import { useTranslation } from "react-i18next";

export default function useCollapseContext() {
  const context = useContext(CollapseContext);
  const { t } = useTranslation();
  if (!context) {
    throw new Error(t("errors.no_collapse_context"));
  }
  return context;
}
