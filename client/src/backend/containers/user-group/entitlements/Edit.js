import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import Layout from "backend/components/layout";
import Form from "./Form";

export default function UserGroupEntitlementEdit() {
  const { t } = useTranslation();
  const { userGroup, refresh, entitlements } = useOutletContext();
  const { entitlementId } = useParams();

  const entitlement = entitlements?.find(e => e.id === entitlementId);

  if (!entitlement) return null;

  const { titlePlaintext } =
    entitlement.relationships?.entitleable?.attributes ?? {};

  return (
    <section>
      <Layout.DrawerHeader
        title={titlePlaintext}
        instructions={t("records.user_groups.entitlements.edit_instructions")}
      />
      <Form userGroup={userGroup} refresh={refresh} entitlement={entitlement} />
    </section>
  );
}

UserGroupEntitlementEdit.displayName = "UserGroupEntitlements.Edit";
