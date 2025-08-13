import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

export default function ButtonGroup({ selected, handleSave, handleClose }) {
  const { t } = useTranslation();

  return (
    <Styled.ButtonGroup>
      <button
        type="submit"
        className="button-secondary"
        disabled={handleSave && !selected}
        onClick={handleSave}
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
