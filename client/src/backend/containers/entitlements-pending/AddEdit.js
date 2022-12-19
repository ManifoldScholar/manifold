import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Navigation from "backend/components/navigation";
import { AddEditForm } from "backend/components/pending-entitlements";
import { useParams } from "react-router-dom";
import { useFetch } from "hooks";
import { pendingEntitlementsAPI } from "api";

export default function EntitlementNewContainer({ refresh }) {
  const { t } = useTranslation();
  const { id } = useParams();

  const { data: entitlement } = useFetch({
    request: [pendingEntitlementsAPI.show, id],
    condition: !!id
  });

  return (
    <section>
      <Navigation.DrawerHeader
        title={
          id
            ? t("backend.pending_entitlements.form.edit_header")
            : t("backend.pending_entitlements.form.add_header")
        }
        instructions={
          !id && t("backend.pending_entitlements.form.add_instructions")
        }
      />
      <AddEditForm refresh={refresh} entitlement={entitlement} />
    </section>
  );
}

EntitlementNewContainer.displayName = "PendingEntitlements.Create";

EntitlementNewContainer.propTypes = {};
