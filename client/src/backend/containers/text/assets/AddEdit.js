import { useTranslation } from "react-i18next";
import { useParams, useOutletContext } from "react-router-dom";
import Layout from "backend/components/layout";
import { useFetch } from "hooks";
import { ingestionSourcesAPI } from "api";
import AddEditAssetForm from "backend/components/authoring/AddEditAssetForm";

export default function AddEditAssetContainer() {
  const { t } = useTranslation();
  const { assetId } = useParams();
  const { textId, refresh } = useOutletContext() || {};

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
