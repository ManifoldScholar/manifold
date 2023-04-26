import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import { CSVImport } from "backend/components/pending-entitlements";

export default function EntitlementImportContainer({ refresh }) {
  const { t } = useTranslation();

  return (
    <section>
      <Layout.DrawerHeader title={t("entitlements.pending.import_header")} />
      <CSVImport refresh={refresh} />
    </section>
  );
}

EntitlementImportContainer.displayName = "PendingEntitlements.Import";

EntitlementImportContainer.propTypes = {};
