import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { entitlementImportsAPI } from "api";
import EntitiesList, {
  EntitlementImportRow
} from "backend/components/list/EntitiesList";
import { useFetch, usePaginationState } from "hooks";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";
import PageHeader from "backend/components/layout/PageHeader";

export default function EntitlementImportsList() {
  const { t } = useTranslation();

  const [pagination, setPageNumber] = usePaginationState(1, 10);

  const { data: csvImports, meta } = useFetch({
    request: [entitlementImportsAPI.index, null, pagination]
  });

  const utility = (
    <Link to={lh.link("backendRecordsEntitlements")} className="utility-button">
      <IconComposer
        icon="eyeOpen32"
        size={26}
        className="utility-button__icon"
      />
      <span className="utility-button__text">
        {t("entitlements.imports.view_pending_label")}
      </span>
    </Link>
  );

  return csvImports ? (
    <>
      <PageHeader
        type="imports"
        title={t("entitlements.imports.header")}
        utility={utility}
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
