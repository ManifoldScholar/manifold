import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { pendingEntitlementsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import Layout from "components/backend/layout";
import { AddEditForm } from "components/backend/pending-entitlements";

export const handle = { drawer: true };

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => pendingEntitlementsAPI.show(params.id),
    request
  });
};

export const action = formAction({
  mutation: ({ data, params }) =>
    pendingEntitlementsAPI.update(params.id, data),
  redirectTo: () => "/backend/records/entitlements"
});

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
