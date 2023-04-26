import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
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
      <Layout.DrawerHeader
        title={
          id
            ? t("entitlements.pending.edit_header")
            : t("entitlements.pending.add_header")
        }
        instructions={!id && t("entitlements.pending.add_instructions")}
      />
      <AddEditForm refresh={refresh} entitlement={entitlement} />
    </section>
  );
}

EntitlementNewContainer.displayName = "PendingEntitlements.Create";

EntitlementNewContainer.propTypes = {};
