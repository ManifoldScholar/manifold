import { useCallback } from "react";
import PropTypes from "prop-types";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { pendingEntitlementsAPI } from "api";
import { useNavigate } from "react-router-dom";
import { useEntitlementSubjectTypeahead } from "hooks";

export default function AddEntitlementForm({ refresh }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    options,
    updateOptions,
    optionToLabel,
    optionToValue
  } = useEntitlementSubjectTypeahead();

  const onSuccess = useCallback(() => {
    if (refresh) refresh();
    navigate(lh.link("backendRecordsEntitlements"));
  }, [navigate, refresh]);

  const formatData = data => {
    const { expiresOn, ...rest } = data.attributes;
    return {
      attributes: {
        expiration: expiresOn,
        ...rest
      }
    };
  };

  return (
    <FormContainer.Form
      name="backend-pending-entitlement-create"
      className="form-secondary"
      onSuccess={onSuccess}
      formatData={formatData}
      create={pendingEntitlementsAPI.create}
    >
      <Form.FieldGroup label={t("entitlements.pending.user_group_label")}>
        <Form.TextInput
          focusOnMount
          label={t("entitlements.pending.email")}
          instructions={t("entitlements.pending.email_instructions")}
          name="attributes[email]"
        />
        <Form.TextInput
          label={t("entitlements.pending.first_name")}
          name="attributes[firstName]"
        />
        <Form.TextInput
          label={t("entitlements.pending.last_name")}
          name="attributes[lastName]"
        />
      </Form.FieldGroup>
      <Form.FieldGroup
        label={t("entitlements.pending.entitlement_group_label")}
      >
        <Form.Picker
          name="attributes[subjectUrl]"
          label={t("entitlements.pending.target_label")}
          placeholder={t("entitlements.pending.target_placeholder")}
          options={options}
          updateOptions={updateOptions}
          optionToLabel={optionToLabel}
          optionToValue={optionToValue}
          listStyle="rows"
        />
        <Form.DatePicker
          label={t("entitlements.pending.expiration")}
          instructions={t("entitlements.pending.expiration_instructions")}
          name="attributes[expiresOn]"
        />
      </Form.FieldGroup>
      <Form.DrawerButtons
        showCancel
        cancelUrl={lh.link("backendRecordsEntitlements")}
        submitLabel="entitlements.pending.save_label"
      />
    </FormContainer.Form>
  );
}

AddEntitlementForm.displayName = "Records.Entitlements.Add.Form";

AddEntitlementForm.propTypes = {
  refresh: PropTypes.func.isRequired
};
