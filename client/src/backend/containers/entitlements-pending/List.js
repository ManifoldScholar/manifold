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
import { useFetch, usePaginationState, useFilterState } from "hooks";
import { childRoutes } from "helpers/router";
import withFilteredLists, { entitlementFilters } from "hoc/withFilteredLists";

function PendingEntitlementsList({
  route,
  history,
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const { t } = useTranslation();

  const [pagination, setPageNumber] = usePaginationState();
  const baseFilters = entitiesListSearchParams.initialentitlements;
  const [filters, setFilters] = useFilterState(baseFilters);

  const { data: entitlements, meta } = useFetch({
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
        closeUrl
      },
      childProps: {}
    });
  };

  const { setParam, ...searchProps } = entitiesListSearchProps("entitlements");
  const updatedSetParam = (param, value) => {
    setParam(param, value);
    setFilters({ newState: { ...filters, [param.name]: value } });
  };

  const onEdit = id => {
    history.push(lh.link("backendRecordsEntitlementsEdit", id));
  };

  return (
    <>
      {renderChildRoutes()}
      {entitlements && (
        <EntitiesList
          title={t("backend.entitlement_imports.header")}
          titleStyle="bar"
          entityComponent={PendingEntitlementRow}
          entityComponentProps={{ onEdit }}
          entities={entitlements}
          buttons={[
            <Button
              path={lh.link("backendRecordsEntitlementsNew")}
              type="add"
              text={t("backend.entitlement_imports.add_button_label")}
              authorizedFor="entitlement"
            />,
            <Button
              path={lh.link("backendRecordsEntitlementsImport")}
              type="import"
              text={t("backend.entitlement_imports.button_label")}
              authorizedFor="entitlement"
            />
          ]}
          search={<Search {...searchProps} setParam={updatedSetParam} />}
          pagination={meta.pagination}
          showCount
          unit={t("glossary.entitlement", {
            count: meta.pagination.totalCount
          })}
          callbacks={{
            onPageClick: page => () => setPageNumber(page)
          }}
        />
      )}
    </>
  );
}

export default withFilteredLists(PendingEntitlementsList, {
  entitlements: entitlementFilters()
});

PendingEntitlementsList.displayName = "PendingEntitlements.List";

PendingEntitlementsList.propTypes = {};
