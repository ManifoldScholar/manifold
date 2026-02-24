import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import lh from "helpers/linkHandler";
import { pendingEntitlementsAPI } from "api";
import EntitiesList, {
  Button,
  Search,
  PendingEntitlementRow
} from "backend/components/list/EntitiesList";
import { useFetch, useApiCallback, useListQueryParams } from "hooks";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import withFilteredLists, { entitlementFilters } from "hoc/withFilteredLists";
import withConfirmation from "hoc/withConfirmation";
import PageHeader from "backend/components/layout/PageHeader";
import Authorize from "hoc/Authorize";

function PendingEntitlementsList({
  confirm,
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const { pagination, filters, searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: entitiesListSearchParams.initialentitlements,
    initSearchProps: entitiesListSearchProps("entitlements")
  });

  const { data: entitlements, meta, refresh } = useFetch({
    request: [pendingEntitlementsAPI.index, filters, pagination],
    dependencies: [filters]
  });

  const closeUrl = lh.link("backendRecordsEntitlements");
  const drawerProps = {
    lockScroll: "always",
    wide: true,
    closeUrl,
    showNotifications: location.pathname.includes("import")
  };

  const onEdit = id => {
    navigate(lh.link("backendRecordsEntitlementsEdit", id));
  };

  const deleteEntitlement = useApiCallback(pendingEntitlementsAPI.destroy);

  const onDelete = id => {
    const heading = t("modals.delete_entitlement");
    const message = t("modals.confirm_body");
    if (confirm)
      confirm(heading, message, async () => {
        await deleteEntitlement(id);
        refresh();
      });
  };

  const actions = [
    {
      label: "entitlements.imports.view_imports_label",
      route: "backendRecordsEntitlementImports",
      icon: "eyeOpen32"
    }
  ];

  return (
    <Authorize
      ability="update"
      entity={["pendingEntitlement"]}
      failureNotification={{
        body: t("errors.access_denied.authorization_admin_type", {
          type: "entitlements"
        })
      }}
      failureRedirect
    >
      <OutletWithDrawer drawerProps={drawerProps} context={{ refresh }} />
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
                path={lh.link("backendRecordsEntitlementsNew")}
                type="add"
                text={t("entitlements.pending.add_button_label")}
                authorizedFor="entitlement"
              />,
              <Button
                path={lh.link("backendRecordsEntitlementsImport")}
                type="import"
                text={t("entitlements.pending.import_button_label")}
                authorizedFor="entitlement"
              />,
              <Button
                tag="button"
                style={{ marginInlineStart: "auto" }}
                onClick={refresh}
                type="reload"
                text={"Refresh"}
                authorizedFor="entitlement"
              />
            ]}
            search={<Search {...searchProps} />}
            pagination={meta.pagination}
            showCount
            unit={t("glossary.pending_entitlement", {
              count: meta.pagination.totalCount
            })}
          />
        </>
      )}
    </Authorize>
  );
}

export default withFilteredLists(withConfirmation(PendingEntitlementsList), {
  entitlements: entitlementFilters()
});

PendingEntitlementsList.displayName = "PendingEntitlements.List";

PendingEntitlementsList.propTypes = {
  confirm: PropTypes.func,
  entitiesListSearchProps: PropTypes.func,
  entitiesListSearchParams: PropTypes.object
};
