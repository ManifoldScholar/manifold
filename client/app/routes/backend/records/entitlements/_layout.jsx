import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useRevalidator } from "react-router";
import { pendingEntitlementsAPI } from "api";
import authorize from "app/routes/utility/loaders/authorize";
import loadList from "app/routes/utility/loaders/loadList";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import { useListQueryParams, useApiCallback } from "hooks";
import useConfirmation from "hooks/useConfirmation";
import Dialog from "global/components/dialog";
import EntitiesList, {
  Button,
  Search,
  PendingEntitlementRow
} from "backend/components/list/EntitiesList";
import PageHeader from "backend/components/layout/PageHeader";
import { INIT_FILTERS, INIT_SEARCH_PROPS } from "./filters";

export const loader = async ({ request, context }) => {
  await authorize({
    request,
    context,
    ability: "update",
    entity: ["pendingEntitlement"]
  });
  return loadList({
    request,
    context,
    fetchFn: pendingEntitlementsAPI.index,
    options: {
      defaultPagination: { page: 1, perPage: 10 },
      defaultFilters: INIT_FILTERS
    }
  });
};

export default function PendingEntitlementsLayout({ loaderData }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { revalidate } = useRevalidator();
  const { confirm, confirmation } = useConfirmation();

  const { searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: INIT_FILTERS,
    initSearchProps: INIT_SEARCH_PROPS
  });

  const { data: entitlements, meta } = loaderData;

  const navigate = useNavigate();
  const deleteEntitlement = useApiCallback(pendingEntitlementsAPI.destroy);

  const onEdit = id => {
    navigate(`/backend/records/entitlements/edit/${id}`);
  };

  const onDelete = id => {
    confirm({
      heading: t("modals.delete_entitlement"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        await deleteEntitlement(id);
        closeDialog();
        revalidate();
      }
    });
  };

  const actions = [
    {
      label: "entitlements.imports.view_imports_label",
      path: "/backend/records/entitlement-imports",
      icon: "eyeOpen32"
    }
  ];

  const drawerProps = {
    lockScroll: "always",
    wide: true,
    closeUrl: "/backend/records/entitlements",
    showNotifications: location.pathname.includes("import")
  };

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <OutletWithDrawer drawerProps={drawerProps} />
      {entitlements && (
        <>
          <PageHeader
            type="entitlements"
            title={t("entitlements.pending.header")}
            actions={actions}
          />
          <EntitiesList
            entityComponent={PendingEntitlementRow}
            entityComponentProps={{ onEdit, onDelete }}
            entities={entitlements}
            buttons={[
              <Button
                key="add"
                path="/backend/records/entitlements/new"
                type="add"
                text={t("entitlements.pending.add_button_label")}
                authorizedFor="entitlement"
              />,
              <Button
                key="import"
                path="/backend/records/entitlements/import"
                type="import"
                text={t("entitlements.pending.import_button_label")}
                authorizedFor="entitlement"
              />,
              <Button
                key="refresh"
                tag="button"
                style={{ marginInlineStart: "auto" }}
                onClick={revalidate}
                type="reload"
                text="Refresh"
                authorizedFor="entitlement"
              />
            ]}
            search={<Search {...searchProps} />}
            pagination={meta?.pagination}
            showCount
            unit={t("glossary.pending_entitlement", {
              count: meta?.pagination?.totalCount
            })}
          />
        </>
      )}
    </>
  );
}
