import { useState, useId } from "react";
import { useTranslation } from "react-i18next";
import DisplayOption from "./DisplayOption";
import Utility from "global/components/utility";
import Button from "global/components/atomic/Button";
import * as Styled from "./styles";

export default function DisplaySelectModal({
  onClose,
  handleNext,
  pendingAnnotation,
  dialog
}) {
  const { t } = useTranslation();

  const [display, setDisplay] = useState("inline");

  const handleSubmit = e => {
    e.preventDefault();
    dialog.onCloseClick();
    handleNext(display);
  };

  const handleClose = e => {
    e.preventDefault();
    dialog.onCloseClick();
    onClose();
  };

  const id = useId();

  return (
    <Styled.Dialog
      ref={dialog.dialogRef}
      inert={!dialog.open ? "" : undefined}
      aria-labelledby={id}
    >
      <Styled.Form onSubmit={handleSubmit}>
        <Styled.Header>
          <Styled.TextColumn>
            <h2 id={id}>{t("reader.resource_display.header")}</h2>
            <Styled.Instructions>
              {t("reader.resource_display.instructions")}
            </Styled.Instructions>
          </Styled.TextColumn>
          <Styled.CloseButton onClick={handleClose}>
            <span>{t("actions.close")}</span>
            <Utility.IconComposer icon="close16" size={16} />
          </Styled.CloseButton>
        </Styled.Header>
        <Styled.Options>
          <DisplayOption
            value="inline"
            title={t("reader.resource_display.inline.title")}
            description={t("reader.resource_display.inline.description")}
            onChange={() => setDisplay("inline")}
            defaultChecked
          />
          <DisplayOption
            value="block"
            title={t("reader.resource_display.block.title")}
            description={t("reader.resource_display.block.description")}
            onChange={() => setDisplay("block")}
            disabled={!pendingAnnotation?.blockResourceAllowed}
          />
        </Styled.Options>
        {!pendingAnnotation?.blockResourceAllowed && (
          <Styled.Warning>
            {t("reader.resource_display.block.selection_warning")}
          </Styled.Warning>
        )}
        <Styled.ButtonGroup>
          <Button
            type="submit"
            background="accent"
            label={t("reader.resource_display.submit_label")}
          />
          <Button onClick={handleClose} label={t("actions.cancel")} />
        </Styled.ButtonGroup>
      </Styled.Form>
    </Styled.Dialog>
  );
}
