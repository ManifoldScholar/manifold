import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import Layout from "backend/components/layout";
import { CSVImport } from "backend/components/pending-entitlements";

export default function EntitlementImportContainer() {
  const outletContext = useOutletContext() || {};
  const { refresh } = outletContext;
  const { t } = useTranslation();

  return (
    <section>
      <Layout.DrawerHeader title={t("entitlements.pending.import_header")} />
      <CSVImport refresh={refresh} />
    </section>
  );
}

EntitlementImportContainer.displayName = "PendingEntitlements.Import";
