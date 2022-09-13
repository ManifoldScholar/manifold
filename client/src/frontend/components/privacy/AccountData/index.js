import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DeleteConfirm from "./DeleteConfirm";
import * as Styled from "./styles";

export default function AccountData() {
  const { t } = useTranslation();

  const [showDeleteConfirm, setShowConfirm] = useState(false);

  return (
    <div>
      <Styled.SectionHeader>
        {t("forms.privacy.account_data")}
      </Styled.SectionHeader>
      <Styled.Section>
        <Styled.ButtonGroup>
          <Styled.Legend>{t("forms.privacy.download.header")}</Styled.Legend>
          <Styled.Instructions>
            {t("forms.privacy.download.description")}
          </Styled.Instructions>
          <Styled.Button
            styleType="outline"
            label="forms.privacy.download.button_label"
          />
        </Styled.ButtonGroup>
        <Styled.ButtonGroup>
          <Styled.Legend>{t("forms.privacy.delete.header")}</Styled.Legend>
          <Styled.Instructions>
            {t("forms.privacy.delete.description")}
          </Styled.Instructions>
          <Styled.Button
            styleType="outline"
            onClick={() => setShowConfirm(true)}
            label="forms.privacy.delete.button_label"
          />
        </Styled.ButtonGroup>
      </Styled.Section>
      {showDeleteConfirm && <DeleteConfirm />}
    </div>
  );
}

AccountData.displayName = "Frontend.Privacy.AccountData";
