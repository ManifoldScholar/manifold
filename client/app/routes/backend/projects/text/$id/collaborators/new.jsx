import { useTranslation } from "react-i18next";
import { useOutletContext, useFetcher } from "react-router";
import { collaboratorsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import Layout from "backend/components/layout";
import AddCollaboratorForm from "backend/components/collaborator/AddForm";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data, params }) =>
    collaboratorsAPI.create("texts", params.id, data),
  redirectTo: ({ params }) =>
    `/backend/projects/text/${params.id}/collaborators`
});

export default function TextCollaboratorNew() {
  const { t } = useTranslation();
  const text = useOutletContext();
  const fetcher = useFetcher();

  return (
    <section>
      <Layout.DrawerHeader title={t("projects.add_contributor_label")} />
      <AddCollaboratorForm
        closeUrl={`/backend/projects/text/${text.id}/collaborators`}
        fetcher={fetcher}
      />
    </section>
  );
}
