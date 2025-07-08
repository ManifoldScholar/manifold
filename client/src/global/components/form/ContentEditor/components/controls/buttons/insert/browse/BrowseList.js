import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { projectsAPI } from "api";
import { useParams } from "react-router-dom";
import { useFetch, usePaginationState, useFromStore } from "hooks";
import EntitiesList, {
  Button,
  Search,
  ResourceRow
} from "backend/components/list/EntitiesList";

export default function BrowseList({ active, setActive }) {
  const { t } = useTranslation();
  const { id } = useParams();

  const text = useFromStore(`entityStore.entities.texts["${id}"]`);
  const projectId = text?.relationships?.project?.data?.id;

  const [pagination] = usePaginationState();

  const filters = useMemo(() => ({}), []);

  const { data: resources, meta: resourcesMeta } = useFetch({
    request: [projectsAPI.resources, projectId, filters, pagination],
    condition: !!projectId
  });

  const onRowClick = resource => setActive(resource.id);

  return resources ? (
    <EntitiesList
      entityComponent={ResourceRow}
      entityComponentProps={{ onRowClick, active }}
      entities={resources}
      unit={t("glossary.resource", {
        count: resourcesMeta?.pagination?.totalCount
      })}
      pagination={resourcesMeta.pagination}
      showCount
      listStyle="grid"
    />
  ) : (
    <div>Loading...</div>
  );
}
