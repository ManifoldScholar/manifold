import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { pendingEntitlementsAPI } from "api";
import EntitiesList, {
  Button,
  Search,
  PendingEntitlementRow
} from "backend/components/list/EntitiesList";
import {
  useFetch,
  usePaginationState,
  useFilterState,
  useApiCallback
} from "hooks";
import { childRoutes } from "helpers/router";
import withFilteredLists, { entitlementFilters } from "hoc/withFilteredLists";
import withConfirmation from "hoc/withConfirmation";
import PageHeader from "backend/components/layout/PageHeader";

function PendingEntitlementsList({
  route,
  history,
  confirm,
  location,
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const { t } = useTranslation();

  const [pagination, setPageNumber] = usePaginationState(1, 10);
  const baseFilters = entitiesListSearchParams.initialentitlements;
  const [filters, setFilters] = useFilterState(baseFilters);

  const { data: entitlements, meta, refresh } = useFetch({
    request: [pendingEntitlementsAPI.index, filters, pagination],
    dependencies: [filters]
  });

  const renderChildRoutes = () => {
    const closeUrl = lh.link("backendRecordsEntitlements");

    return childRoutes(route, {
      drawer: true,
      drawerProps: {
        lockScroll: "always",
        wide: true,
        closeUrl,
        showNotifications: location.pathname.includes("import")
      },
      childProps: { refresh }
    });
  };

  const { setParam, onReset, ...searchProps } = entitiesListSearchProps(
    "entitlements"
  );
  const updatedSetParam = (param, value) => {
    setParam(param, value);
    setFilters({ newState: { ...filters, [param.as || param.name]: value } });
  };
  const updatedOnReset = () => {
    onReset();
    setFilters({ newState: baseFilters });
  };

  const onEdit = id => {
    history.push(lh.link("backendRecordsEntitlementsEdit", id));
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
    <>
      {renderChildRoutes()}
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
            search={
              <Search
                {...searchProps}
                setParam={updatedSetParam}
                onReset={updatedOnReset}
              />
            }
            pagination={meta.pagination}
            showCount
            unit={t("glossary.pending_entitlement", {
              count: meta.pagination.totalCount
            })}
            callbacks={{
              onPageClick: page => () => setPageNumber(page)
            }}
          />
        </>
      )}
    </>
  );
}

export default withFilteredLists(withConfirmation(PendingEntitlementsList), {
  entitlements: entitlementFilters()
});

PendingEntitlementsList.displayName = "PendingEntitlements.List";

PendingEntitlementsList.propTypes = {
  route: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  confirm: PropTypes.func,
  location: PropTypes.object.isRequired,
  entitiesListSearchProps: PropTypes.func,
  entitiesListSearchParams: PropTypes.object
};
