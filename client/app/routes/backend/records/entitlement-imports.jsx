import { useTranslation } from "react-i18next";
import { entitlementImportsAPI } from "api";
import authorize from "app/routes/utility/loaders/authorize";
import loadList from "app/routes/utility/loaders/loadList";
import EntitiesList, {
  EntitlementImportRow
} from "backend/components/list/EntitiesList";
import PageHeader from "backend/components/layout/PageHeader";

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
    fetchFn: entitlementImportsAPI.index,
    options: {
      defaultPagination: { page: 1, perPage: 10 }
    }
  });
};

export default function EntitlementImportsRoute({ loaderData }) {
  const { t } = useTranslation();
  const { data: csvImports, meta } = loaderData;

  const actions = [
    {
      label: "entitlements.imports.view_pending_label",
      path: "/backend/records/entitlements",
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
        pagination={meta?.pagination}
        showCount
        unit={t("glossary.import", {
          count: meta?.pagination?.totalCount
        })}
      />
    </>
  ) : null;
}
