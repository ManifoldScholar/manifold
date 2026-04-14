import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext } from "react-router";
import { ingestionSourcesAPI } from "api";
import Layout from "components/backend/layout";
import AddEditAssetForm from "components/backend/authoring/AddEditAssetForm";
import formAction from "app/routes/utility/helpers/formAction";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data, params }) => ingestionSourcesAPI.create(params.id, data),
  redirectTo: ({ params }) => `/backend/projects/text/${params.id}/assets`
});

export default function NewAsset() {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const text = useOutletContext();

  return (
    <section>
      <Layout.DrawerHeader title={t("texts.assets.add_button_label")} />
      <AddEditAssetForm textId={text.id} fetcher={fetcher} />
    </section>
  );
}
