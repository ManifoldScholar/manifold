import { useEffect } from "react";
import PropTypes from "prop-types";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import { useNotifications } from "hooks";

export default function CSVImportForm({ fetcher }) {
  const { t } = useTranslation();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (fetcher.data?.success) {
      addNotification({
        level: 0,
        id: "Entitlement_Import_Success",
        heading: t("notifications.entitlement_import_success"),
        body: t("notifications.entitlement_import_success_body"),
        scope: "drawer"
      });
    }
  }, [fetcher.data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FormContainer.Form
      fetcher={fetcher}
      className="form-secondary"
      notificationScope="drawer"
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
        cancelUrl="/backend/records/entitlements"
        submitLabel="entitlements.pending.submit_label"
      />
    </FormContainer.Form>
  );
}

CSVImportForm.displayName = "Records.Entitlements.CSVImport.Form";

CSVImportForm.propTypes = {
  fetcher: PropTypes.object.isRequired
};
