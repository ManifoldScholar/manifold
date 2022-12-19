import React, { useCallback } from "react";
import PropTypes from "prop-types";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { pendingEntitlementsAPI } from "api";
import { useHistory } from "react-router-dom";

export default function AddEditEntitlementForm({ refresh, entitlement }) {
  const { t } = useTranslation();
  const history = useHistory();

  const onSuccess = useCallback(() => {
    if (refresh) refresh();
    history.push(lh.link("backendRecordsEntitlements"));
  }, [history, refresh]);

  return (
    <FormContainer.Form
      model={entitlement}
      name={"backend-entitlement-import-create"}
      className="form-secondary"
      onSuccess={onSuccess}
      create={pendingEntitlementsAPI.create}
      update={pendingEntitlementsAPI.update}
    >
      <Form.TextInput
        focusOnMount
        label={t("backend.entitlement_imports.form.name_label")}
        instructions={t("backend.entitlement_imports.form.name_instructions")}
        name="attributes[email]"
      />
      <Form.TextInput
        label={t("backend.entitlement_imports.form.name_label")}
        instructions={t("backend.entitlement_imports.form.name_instructions")}
        name="attributes[firstName]"
      />
      <Form.TextInput
        label={t("backend.entitlement_imports.form.name_label")}
        instructions={t("backend.entitlement_imports.form.name_instructions")}
        name="attributes[lastName]"
      />
      <Form.TextInput
        label={t("backend.entitlement_imports.form.name_label")}
        instructions={t("backend.entitlement_imports.form.name_instructions")}
        name="attributes[name]"
      />
      <Form.DatePicker name="attributes[expiration]" />
      <Form.DrawerButtons
        showCancel
        cancelUrl={lh.link("backendRecordsEntitlements")}
        submitLabel="backend.forms.text_create.save_button_label"
      />
    </FormContainer.Form>
  );
}

AddEditEntitlementForm.displayName = "Records.Entitlements.AddEdit.Form";

AddEditEntitlementForm.propTypes = {};
