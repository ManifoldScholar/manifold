import { useTranslation } from "react-i18next";
import { useOutletContext, useRevalidator } from "react-router";
import { userGroupEntitlementsAPI, userGroupsAPI } from "api";
import loadList from "lib/react-router/loaders/loadList";
import OutletWithDrawers from "components/global/router/OutletWithDrawers";
import { useApiCallback, useConfirmation, useFocusAfterRemoval } from "hooks";
import Dialog from "components/global/dialog";
import EntitiesList, {
  Button,
  UserGroupEntitlementRow
} from "components/backend/list/EntitiesList";

export const loader = async ({ params, url, context }) => {
  return loadList({
    url,
    context,
    fetchFn: () => userGroupsAPI.entitlements(params.id),
    options: { skipFilters: true, skipPagination: true }
  });
};

export default function UserGroupEntitlementsLayout({ loaderData }) {
  const { t } = useTranslation();
  const { userGroup } = useOutletContext();
  const { revalidate } = useRevalidator();
  const { confirm, confirmation } = useConfirmation();

  const { data: entitlements } = loaderData;

  const destroyEntitlement = useApiCallback(userGroupEntitlementsAPI.destroy);

  const { listRef, rememberRemoval } = useFocusAfterRemoval(entitlements);

  const onDelete = id => {
    confirm({
      heading: t("modals.delete_entitlement"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        rememberRemoval(id);
        await destroyEntitlement({ id, userGroupId: userGroup.id });
        closeDialog();
        revalidate();
      }
    });
  };

  const drawerProps = {
    lockScroll: "always",
    wide: true,
    closeUrl: `/backend/records/user-groups/${userGroup.id}/entitlements`
  };

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <OutletWithDrawers drawerProps={drawerProps} context={{ userGroup }} />
      {entitlements && (
        <EntitiesList
          wrapperRef={listRef}
          title={t("records.user_groups.entitlements.header")}
          titleStyle="bar"
          entities={entitlements}
          entityComponent={UserGroupEntitlementRow}
          entityComponentProps={{ onDelete }}
          buttons={[
            <Button
              key="add"
              path={`/backend/records/user-groups/${userGroup.id}/entitlements/new`}
              type="add"
              text={t("records.user_groups.entitlements.add_button_label")}
            />
          ]}
        />
      )}
    </>
  );
}
