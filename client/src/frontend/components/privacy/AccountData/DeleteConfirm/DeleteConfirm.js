import React from "react";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

export default function DeleteConfirm() {
  const { t } = useTranslation();

  return (
    <Styled.Box>
      <Styled.Header>{t("forms.privacy.delete.confirm_header")}</Styled.Header>
      <Styled.Instructions>
        {t("forms.privacy.delete.confirm_instructions")}
      </Styled.Instructions>
      <Styled.EmailWrapper>
        <Styled.EmailInput
          placeholder={t("forms.privacy.delete.email_placeholder")}
        />
        <button
          className="button-secondary button-secondary--outlined"
          type="button"
        >
          {t("forms.privacy.delete.confirm_button_label")}
        </button>
      </Styled.EmailWrapper>
    </Styled.Box>
  );
}
