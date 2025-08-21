import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ingestionSourcesAPI } from "api";
import { useParams } from "react-router-dom";
import { useFetch, usePaginationState } from "hooks";
import EntitiesList from "backend/components/list/EntitiesList";
import EditorAsset from "backend/components/list/EntitiesList/entity/AssetRow/Editor";
import * as Styled from "./styles";

export default function BrowseList({ active, setActive, format }) {
  const { t } = useTranslation();
  const { id } = useParams();

  const [pagination, setPageNumber] = usePaginationState(1, 8);

  const filters = useMemo(() => ({ format }), [format]);

  const { data: assets, meta: assetsMeta } = useFetch({
    request: [ingestionSourcesAPI.index, id, filters, pagination],
    condition: !!id
  });

  const onRowClick = asset => setActive(asset);

  return assets ? (
    <>
      <Styled.ListWrapper>
        <EntitiesList
          entityComponent={EditorAsset}
          entityComponentProps={{
            onRowClick,
            active: active?.id,
            format
          }}
          entities={assets}
          unit={t("glossary.asset", {
            count: assetsMeta?.pagination?.totalCount
          })}
          listStyle="modal"
        />
      </Styled.ListWrapper>
      <Styled.Pagination
        pagination={assetsMeta.pagination}
        paginationClickHandler={page => () => setPageNumber(page)}
      />
    </>
  ) : (
    <div>Loading...</div>
  );
}
