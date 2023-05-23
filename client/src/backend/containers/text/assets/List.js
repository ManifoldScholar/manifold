import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "global/components/form";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import EntitiesList, {
  Button,
  Search,
  AssetRow
} from "backend/components/list/EntitiesList";
import {
  useFetch,
  usePaginationState,
  useFilterState,
  useApiCallback
} from "hooks";
import withConfirmation from "hoc/withConfirmation";
import withFilteredLists, { assetFilters } from "hoc/withFilteredLists";
import { ingestionSourcesAPI } from "api";
import * as Styled from "./styles";

function TextAssetsContainer({
  text,
  route,
  confirm,
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const { t } = useTranslation();

  const [pagination, setPageNumber] = usePaginationState(1, 10);
  const baseFilters = entitiesListSearchParams.initialassets;
  const [filters, setFilters] = useFilterState(baseFilters);

  const { data: assets, meta, refresh } = useFetch({
    request: [ingestionSourcesAPI.index, text.id, filters, pagination],
    dependencies: [filters]
  });

  const renderChildRoutes = () => {
    const closeUrl = lh.link("backendTextAssets", text.id);

    return (
      <>
        {childRoutes(route, {
          drawer: true,
          drawerProps: {
            lockScroll: "always",
            lockScrollClickCloses: false,
            closeUrl,
            size: "default",
            padding: "default"
          },
          childProps: {
            textId: text.id,
            sectionIngest: true,
            nextPosition: text.attributes?.sectionsMap?.length + 1,
            refresh
          }
        })}
      </>
    );
  };

  const { setParam, onReset, ...searchProps } = entitiesListSearchProps(
    "assets"
  );
  const updatedSetParam = (param, value) => {
    setParam(param, value);
    setFilters({ newState: { ...filters, [param.as || param.name]: value } });
  };
  const updatedOnReset = () => {
    onReset();
    setFilters({ newState: baseFilters });
  };

  const onEdit = id => {
    history.push(lh.link("backendTextAssetsEdit", id));
  };

  // const deleteAsset = useApiCallback(pendingEntitlementsAPI.destroy);
  //
  // const onDelete = id => {
  //   const heading = t("modals.delete_entitlement");
  //   const message = t("modals.confirm_body");
  //   if (confirm)
  //     confirm(heading, message, () => deleteEntitlement(id).then(refresh()));
  // };

  return (
    <Styled.Wrapper>
      {renderChildRoutes()}
      <Form.Header
        label="Assets"
        instructions="Assets are files that are associated with a text. Assets have stable URLs and can be rendered in the Manifold reader."
      />
      <EntitiesList
        className="full-width"
        entityComponent={AssetRow}
        entityComponentProps={{ onEdit }}
        entities={assets ?? []}
        buttons={[
          <Button
            path={lh.link("backendRecordsEntitlementsNew")}
            type="add"
            text={"Add New Asset"}
            authorizedFor="entitlement"
          />
        ]}
        search={
          <Search
            {...searchProps}
            setParam={updatedSetParam}
            onReset={updatedOnReset}
          />
        }
        pagination={meta?.pagination}
        showCount
        unit={t("glossary.entitlement", {
          count: meta?.pagination.totalCount
        })}
        callbacks={{
          onPageClick: page => () => setPageNumber(page)
        }}
      />
    </Styled.Wrapper>
  );
}

export default withFilteredLists(withConfirmation(TextAssetsContainer), {
  assets: assetFilters()
});

TextAssetsContainer.displayName = "Text.Assets";

TextAssetsContainer.propTypes = {
  text: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};
