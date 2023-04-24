import React from "react";
import PropTypes from "prop-types";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { entitlementImportsAPI } from "api";
import { useDispatch } from "react-redux";
import { notificationActions } from "actions";

export default function CSVImportForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const notifySuccess = () => {
    const notification = {
      level: 0,
      id: "Entitlement_Import_Success",
      heading: t("notifications.entitlement_import_success"),
      body: t("notifications.entitlement_import_success_body"),
      scope: "drawer"
    };
    dispatch(notificationActions.addNotification(notification));
  };

  return (
    <FormContainer.Form
      name={"backend-entitlement-import-create"}
      className="form-secondary"
      onSuccess={notifySuccess}
      create={entitlementImportsAPI.create}
    >
      <Form.Upload
        layout="landscape"
        instructions={t("entitlements.pending.upload_instructions")}
        label={t("entitlements.pending.upload_label")}
        accepts="csv"
        name="attributes[file]"
      />
      <Form.TextInput
        label={t("entitlements.pending.name_label")}
        instructions={t("entitlements.pending.name_instructions")}
        name="attributes[name]"
      />
      <Form.DrawerButtons
        showCancel
        cancelUrl={lh.link("backendRecordsEntitlements")}
        submitLabel="entitlements.pending.submit_label"
      />
    </FormContainer.Form>
  );
}

CSVImportForm.displayName = "Records.Entitlements.CSVImport.Form";

CSVImportForm.propTypes = {};
