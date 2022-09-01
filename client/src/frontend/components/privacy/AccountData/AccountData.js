import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DeleteConfirm from "./DeleteConfirm";

export default function AccountData() {
  const { t } = useTranslation();

  const [showDeleteConfirm, setShowConfirm] = useState(false);

  return (
    <div>
      <h2 className="section-heading-secondary">
        {t("forms.privacy.account_data")}
      </h2>
      <div className="form-group">
        <fieldset className="subscriptions__radio-group form-input">
          <legend className="subscriptions__legend">
            {t("forms.privacy.delete.header")}
          </legend>
          <span className="instructions">
            {t("forms.privacy.delete.description")}
          </span>
          <button
            className="button-secondary button-secondary--outlined"
            style={{ width: "max-content" }}
            type="button"
            onClick={() => setShowConfirm(true)}
          >
            <span className="button-secondary__text">
              {t("forms.privacy.delete.button_label")}
            </span>
          </button>
        </fieldset>
      </div>
      {showDeleteConfirm && <DeleteConfirm />}
    </div>
  );
}
