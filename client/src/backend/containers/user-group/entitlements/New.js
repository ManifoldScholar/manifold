import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import Layout from "backend/components/layout";
import Form from "./Form";

export default function UserGroupEntitlementNew() {
  const { t } = useTranslation();
  const { userGroup, refresh } = useOutletContext();

  return (
    <section>
      <Layout.DrawerHeader
        title={t("records.user_groups.entitlements.add_header")}
        instructions={t("records.user_groups.entitlements.add_instructions")}
      />
      <Form userGroup={userGroup} refresh={refresh} />
    </section>
  );
}

UserGroupEntitlementNew.displayName = "UserGroupEntitlements.New";
