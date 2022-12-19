import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Navigation from "backend/components/navigation";
import { AddEditForm } from "backend/components/pending-entitlements";

export default function EntitlementNewContainer({ refresh }) {
  const { t } = useTranslation();

  return (
    <section>
      <Navigation.DrawerHeader
        title={t("backend.entitlement_imports.drawer_header")}
        instructions="This is a sample description of the drawer. Some more description
        here."
      />
      <AddEditForm refresh={refresh} />
    </section>
  );
}

EntitlementNewContainer.displayName = "PendingEntitlements.Create";

EntitlementNewContainer.propTypes = {};
