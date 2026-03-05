import { useTranslation } from "react-i18next";
import { useFetcher, redirect } from "react-router";
import { featuresAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import authorize from "app/routes/utility/loaders/authorize";
import PageHeader from "backend/components/layout/PageHeader";
import Layout from "backend/components/layout";
import Properties from "backend/components/feature/Properties";

export const loader = ({ request, context }) => {
  return authorize({ request, context, ability: "create", entity: "feature" });
};

export async function action({ request, context }) {
  const data = await request.json();

  try {
    const result = await queryApi(featuresAPI.create(data), context);

    if (result?.errors) {
      return { errors: result.errors };
    }

    throw redirect(`/backend/records/features/${result.data.id}`);
  } catch (error) {
    return handleActionError(error);
  }
}

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
