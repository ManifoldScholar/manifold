import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Navigation from "backend/components/navigation";
import { CSVImport } from "backend/components/pending-entitlements";

export default function EntitlementImportContainer({ refresh }) {
  const { t } = useTranslation();

  return (
    <section>
      <Navigation.DrawerHeader
        title={t("entitlements.pending.import.drawer_header")}
      />
      <CSVImport refresh={refresh} />
    </section>
  );
}

EntitlementImportContainer.displayName = "PendingEntitlements.Import";

EntitlementImportContainer.propTypes = {};
