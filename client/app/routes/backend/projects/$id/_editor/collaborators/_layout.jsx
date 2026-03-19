import { useTranslation } from "react-i18next";
import { useOutletContext, useNavigate, useRevalidator } from "react-router";
import { collaboratorsAPI, projectsAPI } from "api";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import EntitiesList, {
  Button,
  ContributorRow
} from "backend/components/list/EntitiesList";
import Authorization from "helpers/authorization";
import Dialog from "global/components/dialog";
import { useApiCallback } from "hooks";
import useConfirmation from "hooks/useConfirmation";

const authorization = new Authorization();

export default function ProjectCollaboratorsLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const project = useOutletContext();
  const { revalidate } = useRevalidator();
  const { confirm, confirmation } = useConfirmation();

  const closeUrl = `/backend/projects/${project.id}/collaborators`;

  const canUpdate = authorization.authorizeAbility({
    entity: project,
    ability: "updateMakers"
  });

  const destroyCollaborator = useApiCallback(collaboratorsAPI.destroy);
  const updateProject = useApiCallback(projectsAPI.update);

  const onDelete = makerId => {
    confirm({
      heading: t("modals.remove_contributor"),
      callback: async closeDialog => {
        await destroyCollaborator("projects", project.id, { maker: makerId });
        closeDialog();
        revalidate();
      }
    });
  };

  const onReorder = async (_change, flattenedCollaborators) => {
    const data = flattenedCollaborators
      .map(fc =>
        fc.attributes.collaborators.map(c => ({
          id: c,
          type: "collaborators"
        }))
      )
      .flat();

    const { errors } = await updateProject(project.id, {
      attributes: {},
      relationships: { collaborators: { data } }
    });

    if (errors) {
      revalidate();
    }
  };

  const onEdit = id => {
    navigate(`/backend/projects/${project.id}/collaborators/${id}`);
  };

  return (
    <section>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <OutletWithDrawer drawerProps={{ closeUrl }} context={project} />
      <EntitiesList
        className="full-width"
        title={t("projects.contributors_header")}
        titleStyle="bar"
        titleTag="h2"
        callbacks={{ onReorder }}
        sortableStyle="tight"
        entityComponent={ContributorRow}
        entityComponentProps={canUpdate ? { onDelete, onEdit } : null}
        entities={project?.relationships?.flattenedCollaborators ?? []}
        buttons={
          canUpdate
            ? [
                <Button
                  path={`/backend/projects/${project.id}/collaborators/new`}
                  type="add"
                  text={t("projects.add_contributor_label")}
                />
              ]
            : []
        }
      />
    </section>
  );
}
