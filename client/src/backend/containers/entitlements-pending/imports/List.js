import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { entitlementImportsAPI } from "api";
import EntitiesList, {
  EntitlementImportRow
} from "backend/components/list/EntitiesList";
import { useFetch, usePaginationState } from "hooks";
import PageHeader from "backend/components/layout/PageHeader";

export default function EntitlementImportsList() {
  const { t } = useTranslation();

  const [pagination, setPageNumber] = usePaginationState(1, 10);

  const { data: csvImports, meta } = useFetch({
    request: [entitlementImportsAPI.index, null, pagination]
  });

  const actions = [
    {
      label: "entitlements.imports.view_pending_label",
      route: "backendRecordsEntitlements",
      icon: "eyeOpen32"
    }
  ];

  return csvImports ? (
    <>
      <PageHeader
        type="imports"
        title={t("entitlements.imports.header")}
        actions={actions}
      />
      <EntitiesList
        entityComponent={EntitlementImportRow}
        entities={csvImports}
        pagination={meta.pagination}
        showCount
        unit={t("glossary.import", {
          count: meta.pagination?.totalCount
        })}
        callbacks={{
          onPageClick: page => () => setPageNumber(page)
        }}
      />
    </>
  ) : null;
}

EntitlementImportsList.displayName = "EntitlementImports.List";

EntitlementImportsList.propTypes = {
  entitiesListSearchProps: PropTypes.func,
  entitiesListSearchParams: PropTypes.object
};
