import { useTranslation } from "react-i18next";
import { useFetcher, redirect } from "react-router";
import { pendingEntitlementsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import Layout from "backend/components/layout";
import { AddEditForm } from "backend/components/pending-entitlements";

export const handle = { drawer: true };

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => pendingEntitlementsAPI.show(params.id),
    request
  });
};

export async function action({ request, context, params }) {
  const data = await request.json();

  try {
    const result = await queryApi(
      pendingEntitlementsAPI.update(params.id, data),
      context
    );

    if (result?.errors) {
      return { errors: result.errors };
    }

    throw redirect("/backend/records/entitlements");
  } catch (error) {
    return handleActionError(error);
  }
}

export default function PendingEntitlementsEdit({ loaderData: entitlement }) {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <section>
      <Layout.DrawerHeader title={t("entitlements.pending.edit_header")} />
      <AddEditForm fetcher={fetcher} entitlement={entitlement} />
    </section>
  );
}
