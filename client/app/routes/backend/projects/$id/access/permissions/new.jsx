import { useTranslation } from "react-i18next";
import { useFetcher, redirect } from "react-router";
import { permissionsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import Layout from "backend/components/layout";
import PermissionForm from "backend/containers/permission/Form";

export const handle = { drawer: true };

export async function action({ request, context, params }) {
  const data = await request.json();
  const entity = { type: "projects", id: params.id };

  try {
    const result = await queryApi(permissionsAPI.create(entity, data), context);

    if (result?.errors) {
      return { errors: result.errors };
    }

    throw redirect(
      `/backend/projects/${params.id}/access/permissions/${result.data.id}`
    );
  } catch (error) {
    return handleActionError(error);
  }
}

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
