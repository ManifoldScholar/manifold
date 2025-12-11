import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { permissionsAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";
import Layout from "components/backend/layout";
import PermissionForm from "components/backend/permission/Form";

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
