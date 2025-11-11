import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useParams, useOutletContext } from "react-router-dom";
import Layout from "backend/components/layout";
import { AddEditForm } from "backend/components/pending-entitlements";
import { useFetch } from "hooks";
import { pendingEntitlementsAPI } from "api";

export default function EntitlementAddEditContainer() {
  const outletContext = useOutletContext() || {};
  const { refresh } = outletContext;
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

EntitlementAddEditContainer.displayName = "PendingEntitlements.CreateEdit";
