import React, { useCallback } from "react";
import PropTypes from "prop-types";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { pendingEntitlementsAPI, projectsAPI, journalsAPI } from "api";
import { useHistory } from "react-router-dom";

export default function AddEditEntitlementForm({ refresh, entitlement }) {
  const { t } = useTranslation();
  const history = useHistory();

  const onSuccess = useCallback(() => {
    if (refresh) refresh();
    history.push(lh.link("backendRecordsEntitlements"));
  }, [history, refresh]);

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
      model={entitlement}
      name={
        entitlement
          ? "backend-pending-entitlement-update"
          : "backend-pending-entitlement-create"
      }
      className="form-secondary"
      onSuccess={onSuccess}
      formatData={formatData}
      create={pendingEntitlementsAPI.create}
      update={pendingEntitlementsAPI.update}
    >
      {getValue => {
        const type = getValue("entityType");
        const options =
          type === "journal" ? journalsAPI.index : projectsAPI.index;

        return (
          <>
            <Form.FieldGroup
              label={t("entitlements.pending.form.user_group_label")}
            >
              <Form.TextInput
                focusOnMount
                label={t("entitlements.pending.form.email")}
                instructions={t("entitlements.pending.form.email_instructions")}
                name="attributes[email]"
              />
              <Form.TextInput
                label={t("entitlements.pending.form.first_name")}
                name="attributes[firstName]"
              />
              <Form.TextInput
                label={t("entitlements.pending.form.last_name")}
                name="attributes[lastName]"
              />
            </Form.FieldGroup>
            <Form.FieldGroup
              label={t("entitlements.pending.form.entitlement_group_label")}
            >
              <Form.Select
                label={t("entitlements.pending.form.type_label")}
                instructions={t("entitlements.pending.form.type_instructions")}
                name="entityType"
                options={[
                  {
                    label: t("glossary.project_title_case_one"),
                    value: "project"
                  },
                  {
                    label: t("glossary.journal_title_case_one"),
                    value: "journal"
                  }
                ]}
                value="project"
              />
              <Form.Picker
                name="attributes[subjectUrl]"
                label={
                  type ? t(`glossary.${type}_one`) : t(`glossary.project_one`)
                }
                options={options}
                optionToLabel={entity => entity.attributes.titlePlaintext}
                optionToValue={entity =>
                  entity.attributes.entitlementSubjectUrl
                }
                listStyle="rows"
              />
              <Form.DatePicker
                label={t("entitlements.pending.form.expiration")}
                instructions={t(
                  "entitlements.pending.form.expiration_instructions"
                )}
                name="attributes[expiresOn]"
              />
            </Form.FieldGroup>
            <Form.DrawerButtons
              showCancel
              cancelUrl={lh.link("backendRecordsEntitlements")}
              submitLabel="entitlements.pending.form.save_label"
            />
          </>
        );
      }}
    </FormContainer.Form>
  );
}

AddEditEntitlementForm.displayName = "Records.Entitlements.AddEdit.Form";

AddEditEntitlementForm.propTypes = {};
