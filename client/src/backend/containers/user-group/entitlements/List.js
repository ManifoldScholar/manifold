import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { userGroupEntitlementsAPI, userGroupsAPI } from "api";
import EntitiesList, {
  Button,
  UserGroupEntitlementRow
} from "backend/components/list/EntitiesList";
import { useFetch, useApiCallback } from "hooks";
import { childRoutes } from "helpers/router";
import withConfirmation from "hoc/withConfirmation";

function UserGroupEntitlements({ userGroup, route, confirm }) {
  const { t } = useTranslation();

  const { data: entitlements, refresh } = useFetch({
    request: [userGroupsAPI.entitlements, userGroup.id]
  });

  const renderChildRoutes = () => {
    const closeUrl = lh.link(
      "backendRecordsUserGroupEntitlements",
      userGroup.id
    );

    return childRoutes(route, {
      drawer: true,
      drawerProps: {
        lockScroll: "always",
        wide: true,
        closeUrl
      },
      childProps: { refresh, userGroup }
    });
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
      {renderChildRoutes()}
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
  userGroup: PropTypes.object.isRequired,
  refresh: PropTypes.func,
  route: PropTypes.object.isRequired,
  confirm: PropTypes.func,
  entitiesListSearchProps: PropTypes.func,
  entitiesListSearchParams: PropTypes.object
};
