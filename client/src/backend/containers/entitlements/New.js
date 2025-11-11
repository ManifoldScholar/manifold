import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Form from "./Form";
import Layout from "backend/components/layout";

export default function EntitlementNew() {
  const { t } = useTranslation();
  const { entity, closeUrl } = useOutletContext() || {};

  if (!entity) return null;

  return (
    <section>
      <Layout.DrawerHeader title={t("entitlements.new.header")} />
      <Form entity={entity} redirectAfterSuccess={closeUrl} />
    </section>
  );
}

EntitlementNew.displayName = "Entitlements.New";
