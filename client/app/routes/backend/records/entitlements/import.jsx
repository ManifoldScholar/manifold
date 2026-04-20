import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { entitlementImportsAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";
import Layout from "components/backend/layout";
import { CSVImport } from "components/backend/pending-entitlements";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data }) => entitlementImportsAPI.create(data)
});

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
