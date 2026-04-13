import { useParams } from "react-router";
import { useTranslation, Trans } from "react-i18next";
import { entitlementsAPI } from "api";
import EntitiesList, {
  Button,
  Search,
  EntitlementRow
} from "backend/components/list/EntitiesList";
import { useListQueryParams, useApiCallback } from "hooks";

const PER_PAGE = 20;

function EntitlementsList({
  entity,
  entities: entitlements,
  meta: entitlementsMeta
}) {
  const { t } = useTranslation();
  const { id: active } = useParams();

  const { searchProps } = useListQueryParams({ initSize: PER_PAGE });

  const deleteEntitlement = useApiCallback(entitlementsAPI.destroy);
  const onDelete = entitlement => deleteEntitlement(entitlement.id);

  if (!entitlements || !entitlementsMeta || !entity) return null;

  const basePath = entity.type === "journals" ? "journals" : "projects";
  const newUrl = `/backend/${basePath}/${entity.id}/access/entitlements/new`;

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
        titleStyle="section"
        entities={entitlements}
        entityComponent={EntitlementRow}
        entityComponentProps={{
          active,
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
            path={newUrl}
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

export default EntitlementsList;
