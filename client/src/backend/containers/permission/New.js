import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import Form from "./Form";
import Layout from "backend/components/layout";

export default function PermissionNew() {
  const { t } = useTranslation();
  const { entity } = useOutletContext() || {};

  return (
    <section>
      <Layout.DrawerHeader title={t("projects.permissions.header")} />
      <Form entity={entity} />
    </section>
  );
}

PermissionNew.displayName = "Permission.New";
