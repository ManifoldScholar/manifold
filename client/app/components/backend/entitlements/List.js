import { useParams } from "react-router";
import { useTranslation, Trans } from "react-i18next";
import { entitlementsAPI } from "api";
import EntitiesList, {
  Button,
  Search,
  EntitlementRow
} from "components/backend/list/EntitiesList";
import {
  useListQueryParams,
  useApiCallback,
  useFocusAfterRemoval
} from "hooks";
import { Link } from "react-router";

const PER_PAGE = 20;

function EntitlementsList({
  entity,
  preList,
  entities: entitlements,
  meta: entitlementsMeta
}) {
  const { t } = useTranslation();
  const { id: active } = useParams();

  const { searchProps } = useListQueryParams({ initSize: PER_PAGE });

  const deleteEntitlement = useApiCallback(entitlementsAPI.destroy);

  const { listRef, rememberRemoval } = useFocusAfterRemoval(entitlements);

  const onDelete = entitlement => {
    rememberRemoval(entitlement.id);
    deleteEntitlement(entitlement.id);
  };

  if (!entitlements || !entitlementsMeta || !entity) return null;

  const basePath = entity.type === "journals" ? "journals" : "projects";
  const newUrl = `/backend/${basePath}/${entity.id}/access/entitlements/new`;

  const instructions = (
    <Trans
      i18nKey={
        entity.type === "journals"
          ? "entitlements.instructions_journal"
          : "entitlements.instructions_project"
      }
      values={{ gid: entity.attributes.entitlementSubjectUrl }}
      components={[
        <span />,
        <span className="entitlement-gid" />,
        <br />,
        <Link to="/backend/records/user-groups" />
      ]}
    />
  );

  return (
    <section>
      <EntitiesList
        wrapperRef={listRef}
        title={t("entitlements.header", {
          entity: entity.type.slice(0, -1)
        })}
        instructions={instructions}
        titleStyle="section"
        preList={preList}
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
