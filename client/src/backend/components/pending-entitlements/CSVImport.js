import React, { useCallback } from "react";
import PropTypes from "prop-types";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { entitlementImportsAPI } from "api";
import { useHistory } from "react-router-dom";

export default function CSVImportForm({ refresh }) {
  const { t } = useTranslation();
  const history = useHistory();

  const onSuccess = useCallback(() => {
    if (refresh) refresh();
    history.push(lh.link("backendRecordsEntitlements"));
  }, [history, refresh]);

  return (
    <FormContainer.Form
      name={"backend-entitlement-import-create"}
      className="form-secondary"
      onSuccess={onSuccess}
      create={entitlementImportsAPI.create}
    >
      <Form.Upload
        layout="landscape"
        instructions={t("entitlements.pending.upload_instructions")}
        label={t("entitlements.pending.upload_label")}
        accepts="csv"
        name="attributes[file]"
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
