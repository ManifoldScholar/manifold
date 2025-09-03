import { useState } from "react";
import { useTranslation } from "react-i18next";
import DisplayOption from "./DisplayOption";
import * as Styled from "./styles";

export default function DisplaySelectModal({
  handleClose,
  handleNext,
  pendingAnnotation
}) {
  const { t } = useTranslation();

  const [display, setDisplay] = useState("inline");

  const handleSubmit = e => {
    e.preventDefault();
    handleNext(display);
  };

  return (
    <Styled.Dialog
      maxWidth={1006}
      closeOnOverlayClick={false}
      showCloseButton={false}
    >
      <Styled.Form onSubmit={handleSubmit}>
        <Styled.Header>
          <Styled.TextColumn>
            <h2>{t("reader.resource_display.header")}</h2>
            <Styled.Instructions>
              {t("reader.resource_display.instructions")}
            </Styled.Instructions>
          </Styled.TextColumn>
          <Styled.CloseButton onClick={handleClose} tabIndex="0">
            <Styled.CloseText>{t("actions.close")}</Styled.CloseText>
            <Styled.CloseIcon icon="close16" size={16} />
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
            disabled={!pendingAnnotation.blockResourceAllowed}
          />
        </Styled.Options>
        {!pendingAnnotation.blockResourceAllowed && (
          <Styled.Warning>
            {t("reader.resource_display.block.selection_warning")}
          </Styled.Warning>
        )}
        <Styled.ButtonGroup>
          <button type="submit" className="button-secondary">
            <span>{t("reader.resource_display.submit_label")}</span>
          </button>
          <button
            className="button-secondary button-secondary--dull"
            onClick={handleClose}
          >
            <span>{t("actions.cancel")}</span>
          </button>
        </Styled.ButtonGroup>
      </Styled.Form>
    </Styled.Dialog>
  );
}
