import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext } from "react-router";
import { ingestionSourcesAPI } from "api";
import Layout from "backend/components/layout";
import AddEditAssetForm from "backend/components/authoring/AddEditAssetForm";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import formAction from "app/routes/utility/helpers/formAction";

export const handle = { drawer: true };

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => ingestionSourcesAPI.show(params.assetId),
    request
  });
};

export const action = formAction({
  mutation: ({ data, params }) =>
    ingestionSourcesAPI.update(params.assetId, data),
  redirectTo: ({ params }) => `/backend/projects/text/${params.id}/assets`
});

export default function EditAsset({ loaderData: asset }) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const text = useOutletContext();

  return (
    <section>
      <Layout.DrawerHeader
        title={
          asset
            ? t("texts.assets.edit_header")
            : t("texts.assets.add_button_label")
        }
      />
      <AddEditAssetForm
        asset={asset}
        assetId={asset?.id}
        textId={text.id}
        fetcher={fetcher}
      />
    </section>
  );
}
