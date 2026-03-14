import { useTranslation } from "react-i18next";
import { useOutletContext, useFetcher, redirect } from "react-router";
import { collaboratorsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import Layout from "backend/components/layout";
import AddCollaboratorForm from "backend/components/collaborator/AddForm";

export const handle = { drawer: true };

export async function action({ request, context, params }) {
  const data = await request.json();
  try {
    const result = await queryApi(
      collaboratorsAPI.create("projects", params.id, data),
      context
    );
    if (result?.errors) return { errors: result.errors };
    throw redirect(`/backend/projects/${params.id}/collaborators`);
  } catch (error) {
    return handleActionError(error);
  }
}

export default function ProjectCollaboratorNew() {
  const { t } = useTranslation();
  const project = useOutletContext();
  const fetcher = useFetcher();

  return (
    <section>
      <Layout.DrawerHeader title={t("projects.add_contributor_label")} />
      <AddCollaboratorForm
        closeUrl={`/backend/projects/${project.id}/collaborators`}
        fetcher={fetcher}
      />
    </section>
  );
}
