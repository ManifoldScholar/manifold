import { useContext } from "react";
import { useTranslation } from "react-i18next";
import TabsContext from "frontend/components/layout/Tabs/context";
import * as Styled from "./styles";

export default function ButtonGroup({
  selected,
  toCreate,
  handleSave,
  handleCreate,
  handleClose
}) {
  const { t } = useTranslation();

  const { active } = useContext(TabsContext);

  const disableSave = active === "create" ? !toCreate : !selected;

  const onSave = active === "create" ? handleCreate : handleSave;

  return (
    <Styled.ButtonGroup>
      <button
        type="submit"
        className="button-secondary"
        disabled={disableSave}
        onClick={onSave}
      >
        <span>{t("actions.save")}</span>
      </button>
      <button
        onClick={handleClose}
        className="button-secondary button-secondary--dull"
      >
        <span>{t("actions.cancel")}</span>
      </button>
    </Styled.ButtonGroup>
  );
}
