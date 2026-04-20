import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { pendingEntitlementsAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";
import Layout from "components/backend/layout";
import { AddEditForm } from "components/backend/pending-entitlements";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data }) => pendingEntitlementsAPI.create(data),
  redirectTo: () => "/backend/records/entitlements"
});

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
