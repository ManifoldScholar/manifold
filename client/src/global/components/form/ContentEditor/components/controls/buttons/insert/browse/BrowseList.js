import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ingestionSourcesAPI } from "api";
import { useParams } from "react-router-dom";
import { useFetch, usePaginationState } from "hooks";
import EntitiesList, { AssetRow } from "backend/components/list/EntitiesList";

export default function BrowseList({ active, setActive, format }) {
  const { t } = useTranslation();
  const { id } = useParams();

  const [pagination] = usePaginationState();

  const filters = useMemo(() => ({ format }), [format]);

  const { data: assets, meta: assetsMeta } = useFetch({
    request: [ingestionSourcesAPI.index, id, filters, pagination],
    condition: !!id
  });

  const onRowClick = asset => setActive(asset);

  return assets ? (
    <EntitiesList
      entityComponent={AssetRow}
      entityComponentProps={{
        onRowClick,
        active: active?.id,
        isBrowse: true,
        rowClickMode: "block"
      }}
      entities={assets}
      unit={t("glossary.asset", {
        count: assetsMeta?.pagination?.totalCount
      })}
      pagination={assetsMeta.pagination}
      listStyle="grid"
    />
  ) : (
    <div>Loading...</div>
  );
}
