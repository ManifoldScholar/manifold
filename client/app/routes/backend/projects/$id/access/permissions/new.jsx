import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { permissionsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import Layout from "backend/components/layout";
import PermissionForm from "backend/components/permission/Form";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data, params }) =>
    permissionsAPI.create({ type: "projects", id: params.id }, data),
  redirectTo: ({ result, params }) =>
    `/backend/projects/${params.id}/access/permissions/${result.data.id}`
});

export default function ProjectPermissionNew() {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <section>
      <Layout.DrawerHeader title={t("projects.permissions.header")} />
      <PermissionForm fetcher={fetcher} />
    </section>
  );
}
