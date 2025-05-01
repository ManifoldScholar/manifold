import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "global/components/form";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import EntitiesList, {
  Button,
  Search,
  AssetRow,
} from "backend/components/list/EntitiesList";
import { useFetch, useApiCallback, useListQueryParams } from "hooks";
import withConfirmation from "hoc/withConfirmation";
import withFilteredLists, { assetFilters } from "hoc/withFilteredLists";
import { ingestionSourcesAPI } from "api";
import { useNavigate } from "react-router-dom-v5-compat";
import * as Styled from "./styles";

function TextAssetsContainer({
  text,
  route,
  confirm,
  entitiesListSearchProps,
  entitiesListSearchParams,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { pagination, filters, searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: entitiesListSearchParams.initialassets,
    initSearchProps: entitiesListSearchProps("assets"),
  });

  const {
    data: assets,
    meta,
    refresh,
  } = useFetch({
    request: [ingestionSourcesAPI.index, text.id, filters, pagination],
    dependencies: [filters],
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
            padding: "default",
          },
          childProps: {
            textId: text.id,
            refresh,
          },
        })}
      </>
    );
  };

  const onEdit = (id) => {
    navigate(lh.link("backendTextAssetEdit", text.id, id));
  };

  const deleteAsset = useApiCallback(ingestionSourcesAPI.destroy);

  const onDelete = (id) => {
    const heading = t("modals.delete_asset");
    const message = t("modals.confirm_body");
    if (confirm)
      confirm(heading, message, () => deleteAsset(id).then(refresh()));
  };

  return (
    <Styled.Wrapper>
      {renderChildRoutes()}
      <Form.Header
        label={t("texts.assets.header")}
        instructions={t("texts.assets.instructions")}
      />
      {meta && (
        <EntitiesList
          className="full-width"
          entityComponent={AssetRow}
          entityComponentProps={{ onEdit, onDelete }}
          entities={assets ?? []}
          buttons={[
            <Button
              path={lh.link("backendTextAssetNew", text.id)}
              type="add"
              text={t("texts.assets.add_button_label")}
            />,
          ]}
          search={<Search {...searchProps} />}
          pagination={meta?.pagination}
          showCount
          unit={t("glossary.asset", {
            count: meta?.pagination.totalCount,
          })}
        />
      )}
    </Styled.Wrapper>
  );
}

export default withFilteredLists(withConfirmation(TextAssetsContainer), {
  assets: assetFilters(),
});

TextAssetsContainer.displayName = "Text.Assets";

TextAssetsContainer.propTypes = {
  text: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};
