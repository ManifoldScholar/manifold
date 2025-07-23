import { useTranslation } from "react-i18next";
import Button from "global/components/atomic/Button";
import * as Styled from "./styles";

export default function ButtonGroup({ selected, handleSave, handleClose }) {
  const { t } = useTranslation();

  return (
    <Styled.ButtonGroup>
      <Button
        type="submit"
        background="accent"
        disabled={handleSave && !selected}
        onClick={handleSave}
        label={t("actions.save")}
        size="md"
      />
      <Button onClick={handleClose} label={t("actions.cancel")} size="md" />
    </Styled.ButtonGroup>
  );
}
