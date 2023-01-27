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
        {/* Account data download UI to add back when api is ready. */}
        {/* <Styled.ButtonGroup>
          <Styled.Legend>{t("forms.privacy.download.header")}</Styled.Legend>
          <Styled.Instructions>
            {t("forms.privacy.download.description")}
          </Styled.Instructions>
          <Styled.Button className="button-secondary button-secondary--outlined">
            {t("forms.privacy.download.button_label")}
          </Styled.Button>
        </Styled.ButtonGroup> */}
        <Styled.ButtonGroup>
          <Styled.Legend>{t("forms.privacy.delete.header")}</Styled.Legend>
          <Styled.Instructions>
            {t("forms.privacy.delete.description")}
          </Styled.Instructions>
          <Styled.Button
            className="button-secondary button-secondary--outlined"
            onClick={() => setShowConfirm(true)}
          >
            {t("forms.privacy.delete.button_label")}
          </Styled.Button>
        </Styled.ButtonGroup>
      </Styled.Section>
      {showDeleteConfirm && <DeleteConfirm />}
    </div>
  );
}

AccountData.displayName = "Frontend.Privacy.AccountData";
