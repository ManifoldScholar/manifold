import { useTranslation } from "react-i18next";
import { useFetcher, redirect } from "react-router";
import { entitlementsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import Layout from "backend/components/layout";
import EntitlementForm from "backend/containers/entitlements/Form";

export const handle = { drawer: true };

export async function action({ request, context, params }) {
  const data = await request.json();

  try {
    const result = await queryApi(
      entitlementsAPI.create({ type: "projects", id: params.id }, data),
      context
    );

    if (result?.errors) {
      return { errors: result.errors };
    }

    throw redirect(`/backend/projects/${params.id}/access`);
  } catch (error) {
    return handleActionError(error);
  }
}

export default function ProjectEntitlementNew() {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <section>
      <Layout.DrawerHeader title={t("entitlements.new.header")} />
      <EntitlementForm fetcher={fetcher} />
    </section>
  );
}
