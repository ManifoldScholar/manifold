import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useNavigate } from "react-router-dom";
import { collaboratorsAPI, projectsAPI } from "api";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import lh from "helpers/linkHandler";
import EntitiesList, {
  Button,
  ContributorRow
} from "backend/components/list/EntitiesList";
import Authorization from "helpers/authorization";
import { useApiCallback } from "hooks";
import withConfirmation from "hoc/withConfirmation";

const authorization = new Authorization();

function ProjectCollaboratorsContainer({ confirm }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { project, refresh } = useOutletContext() || {};

  const closeUrl = lh.link("backendProjectCollaborators", project?.id);

  const canUpdate = authorization.authorizeAbility({
    entity: project,
    ability: "updateMakers"
  });

  const destroyCollaborator = useApiCallback(collaboratorsAPI.destroy);

  const onDelete = useCallback(
    makerId => {
      const heading = t("modals.remove_contributor");
      if (confirm)
        confirm(heading, null, async () => {
          await destroyCollaborator("projects", project.id, { maker: makerId });
          refresh();
        });
    },
    [project?.id, confirm, destroyCollaborator, t, refresh]
  );

  const updateProject = useApiCallback(projectsAPI.update);

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
      if (refresh) refresh();
    }
  };

  const onEdit = id => {
    navigate(lh.link("backendProjectCollaboratorEdit", project.id, id));
  };

  if (!project) return null;

  return (
    <section>
      <OutletWithDrawer
        drawerProps={{ closeUrl }}
        context={{
          refresh,
          projectId: project?.id
        }}
      />
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
                  path={lh.link("backendProjectCollaboratorNew", project.id)}
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

export default withConfirmation(ProjectCollaboratorsContainer);

ProjectCollaboratorsContainer.displayName = "Project.Collaborators";
