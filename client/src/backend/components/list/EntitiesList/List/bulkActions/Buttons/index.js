import React from "react";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

export default function Buttons({
  active,
  onBulkDelete,
  toggleBulkActions,
  actionsDisabled
}) {
  const { t } = useTranslation();

  return (
    <>
      {active && (
        <Styled.DeleteButton
          tag="button"
          onClick={onBulkDelete}
          text={t("actions.bulk_delete")}
          authorizedFor="annotation"
          icon="delete24"
          disabled={actionsDisabled}
        />
      )}
      <Styled.Toggle
        tag="button"
        className={active ? "active" : undefined}
        onClick={toggleBulkActions}
        text={
          active ? t("actions.cancel") : t("records.annotations.bulk_actions")
        }
        authorizedFor="annotation"
      />
    </>
  );
}
