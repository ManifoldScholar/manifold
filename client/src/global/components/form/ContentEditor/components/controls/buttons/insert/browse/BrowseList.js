import { useTranslation } from "react-i18next";
import EntitiesList from "backend/components/list/EntitiesList";
import EditorAsset from "backend/components/list/EntitiesList/Entity/AssetRow/Editor";
import * as Styled from "./styles";

export default function BrowseList({
  active,
  setActive,
  format,
  assets,
  assetsMeta,
  setPageNumber
}) {
  const { t } = useTranslation();

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
