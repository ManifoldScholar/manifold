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

  const formatData = data => {
    const { expiresOn, entityId, ...rest } = data.attributes;
    return {
      attributes: {
        subjectUrl: `gid://entitlements/Project/${entityId}`,
        expiration: expiresOn,
        ...rest
      }
    };
  };

  const model = entitlement
    ? {
        id: entitlement.id,
        attributes: {
          ...entitlement.attributes,
          entityId: entitlement.attributes?.subjectUrl.split("/").pop()
        }
      }
    : undefined;

  return (
    <FormContainer.Form
      model={model}
      name={
        model
          ? "backend-pending-entitlement-update"
          : "backend-pending-entitlement-create"
      }
      className="form-secondary"
      onSuccess={onSuccess}
      formatData={formatData}
      create={pendingEntitlementsAPI.create}
      update={pendingEntitlementsAPI.update}
    >
      <Form.TextInput
        focusOnMount
        label={t("backend.pending_entitlements.form.email")}
        instructions={t("backend.pending_entitlements.form.email_instructions")}
        name="attributes[email]"
      />
      <Form.TextInput
        label={t("backend.pending_entitlements.form.first_name")}
        name="attributes[firstName]"
      />
      <Form.TextInput
        label={t("backend.pending_entitlements.form.last_name")}
        name="attributes[lastName]"
      />
      <Form.TextInput
        label={t("backend.pending_entitlements.form.entity_id")}
        instructions={t("backend.pending_entitlements.form.id_instructions")}
        placeholder={t("backend.pending_entitlements.form.id_placeholder")}
        name="attributes[entityId]"
      />
      <Form.DatePicker
        label={t("backend.pending_entitlements.form.expiration")}
        instructions={t(
          "backend.pending_entitlements.form.expiration_instructions"
        )}
        name="attributes[expiresOn]"
      />
      <Form.DrawerButtons
        showCancel
        cancelUrl={lh.link("backendRecordsEntitlements")}
        submitLabel="backend.pending_entitlements.form.save_label"
      />
    </FormContainer.Form>
  );
}

AddEditEntitlementForm.displayName = "Records.Entitlements.AddEdit.Form";

AddEditEntitlementForm.propTypes = {};
