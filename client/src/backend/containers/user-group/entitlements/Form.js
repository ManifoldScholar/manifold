import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { journalsAPI, projectsAPI, userGroupEntitlementsAPI } from "api";
import { useNavigate } from "react-router-dom-v5-compat";
import lh from "helpers/linkHandler";

export default function UserGroupEntitlementForm({
  userGroup,
  refresh,
  refreshUserGroup
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onSuccess = useCallback(() => {
    if (refresh) refresh();
    if (refreshUserGroup) refreshUserGroup();
    navigate(lh.link("backendRecordsUserGroupEntitlements", userGroup.id));
  }, [navigate, refresh, refreshUserGroup, userGroup]);

  const create = data =>
    userGroupEntitlementsAPI.create({ data, userGroupId: userGroup.id });

  return (
    <section>
      <FormContainer.Form
        name="backend-user-group-entitlement-create"
        create={create}
        onSuccess={onSuccess}
        className="form-secondary"
        notificationScope="drawer"
      >
        {getValue => {
          const type = getValue("entityType");
          const options =
            type === "journal" ? journalsAPI.index : projectsAPI.index;
          return (
            <>
              <Form.Select
                label={t("entitlements.pending.type_label")}
                instructions={t("entitlements.pending.type_instructions")}
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
                name="attributes[targetUrl]"
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
              <Form.DrawerButtons
                showCancel
                cancelUrl={lh.link(
                  "backendRecordsUserGroupEntitlements",
                  userGroup.id
                )}
                submitLabel="entitlements.new.submit_label"
              />
            </>
          );
        }}
      </FormContainer.Form>
    </section>
  );
}

UserGroupEntitlementForm.displayName = "UserGroupEntitlements.Form";

UserGroupEntitlementForm.propTypes = {
  userGroup: PropTypes.object.isRequired,
  refresh: PropTypes.func,
  refreshUserGroup: PropTypes.func
};
