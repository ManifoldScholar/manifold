import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { userGroupEntitlementsAPI } from "api";
import { useNavigate } from "react-router-dom";
import { useEntitlementSubjectTypeahead } from "hooks";
import lh from "helpers/linkHandler";

export default function UserGroupEntitlementForm({ userGroup, refresh }) {
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
    navigate(lh.link("backendRecordsUserGroupEntitlements", userGroup.id));
  }, [navigate, refresh, userGroup]);

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
        <Form.Picker
          name="attributes[targetUrl]"
          label={t("entitlements.pending.target_label")}
          placeholder={t("entitlements.pending.target_placeholder")}
          options={options}
          updateOptions={updateOptions}
          optionToLabel={optionToLabel}
          optionToValue={optionToValue}
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
      </FormContainer.Form>
    </section>
  );
}

UserGroupEntitlementForm.displayName = "UserGroupEntitlements.Form";

UserGroupEntitlementForm.propTypes = {
  userGroup: PropTypes.object.isRequired,
  refresh: PropTypes.func
};
