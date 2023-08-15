import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import { useParams } from "react-router-dom";
import { useFetch } from "hooks";
import { ingestionSourcesAPI } from "api";
import AddEditAssetForm from "backend/components/authoring/AddEditAssetForm";

export default function AddEditAssetContainer({ textId, refresh }) {
  const { t } = useTranslation();
  const { assetId } = useParams();

  const { data: asset } = useFetch({
    request: [ingestionSourcesAPI.show, assetId],
    condition: !!assetId
  });

  const title = assetId
    ? t("texts.assets.edit_header")
    : t("texts.assets.add_button_label");

  return (
    <section>
      <Layout.DrawerHeader title={title} />
      <AddEditAssetForm
        asset={asset}
        assetId={assetId}
        textId={textId}
        refresh={refresh}
      />
    </section>
  );
}

AddEditAssetContainer.displayName = "Text.Assets.AddEdit";

AddEditAssetContainer.propTypes = {
  textId: PropTypes.string.isRequired
};
