import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { entitlementImportsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import Layout from "backend/components/layout";
import { CSVImport } from "backend/components/pending-entitlements";

export const handle = { drawer: true };

export async function action({ request, context }) {
  const data = await request.json();

  try {
    const result = await queryApi(entitlementImportsAPI.create(data), context);

    if (result?.errors) {
      return { errors: result.errors };
    }

    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

export default function PendingEntitlementsImport() {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <section>
      <Layout.DrawerHeader title={t("entitlements.pending.import_header")} />
      <CSVImport fetcher={fetcher} />
    </section>
  );
}
