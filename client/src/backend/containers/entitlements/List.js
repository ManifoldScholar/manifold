import { useParams } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { entitlementsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import EntitiesList, {
  Button,
  Search,
  EntitlementRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { keywordFilter } from "hoc/withFilteredLists";
import { useFetch, useListQueryParams, useApiCallback } from "hooks";

const PER_PAGE = 20;

function EntitlementsList({
  entity,
  preList,
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const { t } = useTranslation();
  const { id: active } = useParams();

  const { pagination, filters, searchProps } = useListQueryParams({
    initSize: PER_PAGE,
    initFilters: entitiesListSearchParams?.entitlements || {},
    initSearchProps: entitiesListSearchProps("entitlements")
  });

  const { data: entitlements, meta: entitlementsMeta, refresh } = useFetch({
    request: [entitlementsAPI.index, entity, filters, pagination],
    options: { requestKey: requests.beProjectEntitlements },
    condition: !!entity
  });

  const deleteEntitlement = useApiCallback(entitlementsAPI.destroy, {
    requestKey: requests.beProjectEntitlementDestroy,
    refreshes: requests.beProjectEntitlements
  });

  const onDelete = entitlement => {
    deleteEntitlement(entitlement.id).then(() => {
      if (refresh) refresh();
    });
  };

  if (!entitlements || !entitlementsMeta || !entity) return null;

  const listUrl = lh.nameFromType("backend", "Entitlement", entity);
  const newUrl = lh.nameFromType("backend", "EntitlementsNew", entity);
  const instructions = (
    <Trans
      i18nKey="entitlements.instructions_project"
      values={{ gid: entity.attributes.entitlementSubjectUrl }}
      components={[<p />, <p className="entitlement-gid" />, <br />]}
    />
  );

  return (
    <section>
      <EntitiesList
        title={t("entitlements.header", {
          entity: entity.type.slice(0, -1)
        })}
        instructions={instructions}
        preList={preList}
        titleStyle="section"
        entities={entitlements}
        entityComponent={EntitlementRow}
        entityComponentProps={{
          active,
          linkName: listUrl,
          onDelete
        }}
        showCount
        paginationStyle="normal"
        pagination={entitlementsMeta.pagination}
        unit={t("glossary.entitlement", {
          count: entitlementsMeta.pagination.totalCount
        })}
        buttons={[
          <Button
            path={lh.link(newUrl, entity.id)}
            text={t("entitlements.button_label")}
            type="add"
            authorizedTo="update"
            authorizedFor={entity}
          />
        ]}
        search={<Search {...searchProps} />}
      />
    </section>
  );
}

EntitlementsList.displayName = "Entitlements.List";

export default withFilteredLists(EntitlementsList, {
  entitlements: keywordFilter()
});
