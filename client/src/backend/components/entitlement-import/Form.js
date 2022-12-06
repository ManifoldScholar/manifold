import React, { useCallback } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { entitlementImportsAPI } from "api";
import { useHistory } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";
import { Link } from "react-router-dom";

export default function EntitlementImportForm({ refresh }) {
  const { t } = useTranslation();
  const history = useHistory();

  const onSuccess = useCallback(() => {
    if (refresh) refresh();
    history.push(lh.link("backendRecordsEntitlements"));
  }, [history, refresh]);

  const buttonClasses = classNames(
    "buttons-icon-horizontal__button",
    "button-icon-secondary",
    "button-icon-secondary--in-drawer"
  );

  return (
    <FormContainer.Form
      name={"backend-entitlement-import-create"}
      className="form-secondary"
      onSuccess={onSuccess}
      create={entitlementImportsAPI.create}
    >
      <Form.Upload
        layout="landscape"
        instructions={t("backend.entitlement_imports.form.upload_instructions")}
        label={t("backend.entitlement_imports.form.upload_label")}
        accepts="csv"
        name="attributes[file]"
      />
      <Form.TextInput
        focusOnMount
        label={t("backend.entitlement_imports.form.name_label")}
        instructions={t("backend.entitlement_imports.form.name_instructions")}
        name="attributes[name]"
      />
      <div className="buttons-icon-horizontal">
        <Link
          to={lh.link("backendRecordsEntitlements")}
          className={`${buttonClasses} button-icon-secondary--dull`}
        >
          <IconComposer
            icon="close16"
            size="default"
            className="button-icon-secondary__icon"
          />
          <span>{t("actions.cancel")}</span>
        </Link>
        <button type="submit" className={buttonClasses}>
          <IconComposer
            icon="checkmark16"
            size="default"
            className="button-icon-secondary__icon"
          />
          <span>{t("actions.continue")}</span>
        </button>
      </div>
    </FormContainer.Form>
  );
}

EntitlementImportForm.displayName = "Records.EntitlementImport.Create.Form";

EntitlementImportForm.propTypes = {};
