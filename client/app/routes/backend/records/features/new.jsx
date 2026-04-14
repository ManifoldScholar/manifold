import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { featuresAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import authorize from "app/routes/utility/loaders/authorize";
import PageHeader from "components/backend/layout/PageHeader";
import Layout from "components/backend/layout";
import Properties from "components/backend/feature/Properties";

export const loader = ({ request, context }) => {
  return authorize({ request, context, ability: "create", entity: "feature" });
};

export const action = formAction({
  mutation: ({ data }) => featuresAPI.create(data),
  redirectTo: ({ result }) => `/backend/records/features/${result.data.id}`
});

export default function FeaturesNewRoute() {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <>
      <PageHeader
        type="feature"
        backUrl="/backend/records/features"
        backLabel={t("records.features.back_label")}
        title={t("records.features.new_header")}
        note={t("records.features.new_instructions")}
        icon="Lamp64"
      />
      <Layout.BackendPanel>
        <Properties fetcher={fetcher} />
      </Layout.BackendPanel>
    </>
  );
}
