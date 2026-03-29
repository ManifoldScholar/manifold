import { useTranslation } from "react-i18next";
import { useOutletContext, useParams, useFetcher } from "react-router";
import { collaboratorsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import Layout from "backend/components/layout";
import AddCollaboratorForm from "backend/components/collaborator/AddForm";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data, params }) =>
    collaboratorsAPI.update("texts", params.id, data),
  redirectTo: ({ params }) =>
    `/backend/projects/text/${params.id}/collaborators`
});

export default function TextCollaboratorEdit() {
  const { t } = useTranslation();
  const { collaboratorId } = useParams();
  const text = useOutletContext();
  const fetcher = useFetcher();

  const collaborator = text?.relationships?.flattenedCollaborators?.find(
    fc => fc.id === collaboratorId
  );

  return (
    <section>
      <Layout.DrawerHeader
        title={
          collaborator
            ? `Edit ${collaborator.attributes.makerName}`
            : t("projects.add_contributor_label")
        }
      />
      <AddCollaboratorForm
        closeUrl={`/backend/projects/text/${text.id}/collaborators`}
        fetcher={fetcher}
        collaborator={collaborator}
      />
    </section>
  );
}
