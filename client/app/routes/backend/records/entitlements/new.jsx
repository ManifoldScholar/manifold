import { useTranslation } from "react-i18next";
import { useFetcher, redirect } from "react-router";
import { pendingEntitlementsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import Layout from "backend/components/layout";
import { AddEditForm } from "backend/components/pending-entitlements";

export const handle = { drawer: true };

export async function action({ request, context }) {
  const data = await request.json();

  try {
    const result = await queryApi(pendingEntitlementsAPI.create(data), context);

    if (result?.errors) {
      return { errors: result.errors };
    }

    throw redirect("/backend/records/entitlements");
  } catch (error) {
    return handleActionError(error);
  }
}

export default function PendingEntitlementsNew() {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <section>
      <Layout.DrawerHeader
        title={t("entitlements.pending.add_header")}
        instructions={t("entitlements.pending.add_instructions")}
      />
      <AddEditForm fetcher={fetcher} />
    </section>
  );
}
