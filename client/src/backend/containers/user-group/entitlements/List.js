import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import lh from "helpers/linkHandler";
import { userGroupEntitlementsAPI, userGroupsAPI } from "api";
import EntitiesList, {
  Button,
  UserGroupEntitlementRow
} from "backend/components/list/EntitiesList";
import { useFetch, useApiCallback } from "hooks";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import withConfirmation from "hoc/withConfirmation";

function UserGroupEntitlements({ confirm }) {
  const { t } = useTranslation();
  const { userGroup } = useOutletContext();

  const { data: entitlements, refresh } = useFetch({
    request: [userGroupsAPI.entitlements, userGroup.id]
  });

  const drawerProps = {
    lockScroll: "always",
    wide: true,
    closeUrl: lh.link("backendRecordsUserGroupEntitlements", userGroup.id)
  };

  const destroyEntitlement = useApiCallback(userGroupEntitlementsAPI.destroy);

  const onDelete = entitlementId => {
    const heading = t("modals.delete_entitlement");
    const message = t("modals.confirm_body");
    if (confirm) {
      confirm(heading, message, async () => {
        await destroyEntitlement({
          id: entitlementId,
          userGroupId: userGroup.id
        });
        refresh();
      });
    }
  };

  return (
    <>
      <OutletWithDrawer
        drawerProps={drawerProps}
        context={{ refresh, userGroup }}
      />
      {entitlements && (
        <div>
          <EntitiesList
            title={t("records.user_groups.entitlements.header")}
            titleStyle="bar"
            entities={entitlements}
            entityComponent={UserGroupEntitlementRow}
            entityComponentProps={{
              onDelete
            }}
            buttons={[
              <Button
                path={lh.link(
                  "backendRecordsUserGroupEntitlementsNew",
                  userGroup.id
                )}
                type="add"
                text={t("records.user_groups.entitlements.add_button_label")}
              />
            ]}
          />
        </div>
      )}
    </>
  );
}

export default withConfirmation(UserGroupEntitlements);

UserGroupEntitlements.displayName = "UserGroupEntitlements";

UserGroupEntitlements.propTypes = {
  confirm: PropTypes.func
};
