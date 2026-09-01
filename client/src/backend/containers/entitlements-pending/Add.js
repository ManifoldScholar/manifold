import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import Layout from "backend/components/layout";
import { AddForm } from "backend/components/pending-entitlements";

export default function EntitlementAddContainer() {
  const outletContext = useOutletContext() || {};
  const { refresh } = outletContext;
  const { t } = useTranslation();

  return (
    <section>
      <Layout.DrawerHeader
        title={t("entitlements.pending.add_header")}
        instructions={t("entitlements.pending.add_instructions")}
      />
      <AddForm refresh={refresh} />
    </section>
  );
}

EntitlementAddContainer.displayName = "PendingEntitlements.Add";
