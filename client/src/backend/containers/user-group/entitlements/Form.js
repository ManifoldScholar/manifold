import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { userGroupEntitlementsAPI } from "api";
import { useNavigate } from "react-router-dom";
import { useEntitlementSubjectTypeahead } from "hooks";
import lh from "helpers/linkHandler";

export default function UserGroupEntitlementForm({
  userGroup,
  refresh,
  entitlement
}) {
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

  const isEdit = !!entitlement;

  const create = data =>
    userGroupEntitlementsAPI.create({ data, userGroupId: userGroup.id });

  // Only the dirty attributes are sent on update. The picker is not rendered
  // in edit mode, so targetUrl is never included and the entitled subject
  // cannot change. A cleared date is sent as null, which removes the expiration.
  const update = (id, data) =>
    userGroupEntitlementsAPI.update({ id, data, userGroupId: userGroup.id });

  const formProps = isEdit
    ? {
        name: "backend-user-group-entitlement-update",
        model: entitlement,
        update
      }
    : { name: "backend-user-group-entitlement-create", create };

  return (
    <section>
      <FormContainer.Form
        {...formProps}
        onSuccess={onSuccess}
        className="form-secondary"
        notificationScope="drawer"
      >
        {!isEdit && (
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
        )}
        <Form.DatePicker
          label={t("entitlements.pending.expiration")}
          instructions={t("entitlements.pending.expiration_instructions")}
          name="attributes[expiration]"
        />
        <Form.DrawerButtons
          showCancel
          cancelUrl={lh.link(
            "backendRecordsUserGroupEntitlements",
            userGroup.id
          )}
          submitLabel={
            isEdit ? "actions.save" : "entitlements.new.submit_label"
          }
        />
      </FormContainer.Form>
    </section>
  );
}

UserGroupEntitlementForm.displayName = "UserGroupEntitlements.Form";

UserGroupEntitlementForm.propTypes = {
  userGroup: PropTypes.object.isRequired,
  refresh: PropTypes.func,
  entitlement: PropTypes.object
};
