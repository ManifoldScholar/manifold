import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { collaboratorsAPI } from "api";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import EntitiesList, {
  Button,
  ContributorRow
} from "backend/components/list/EntitiesList";
import Authorization from "helpers/authorization";
import { useApiCallback } from "hooks";
import withConfirmation from "hoc/withConfirmation";

function ProjectCollaboratorsContainer({ project, refresh, route, confirm }) {
  const { t } = useTranslation();

  const closeUrl = lh.link("backendProjectCollaborators", project.id);

  const auth = new Authorization();
  const canUpdate = auth.authorizeAbility({
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
    [project.id, confirm, destroyCollaborator, t, refresh]
  );

  return (
    <section>
      {childRoutes(route, {
        drawer: true,
        drawerProps: { closeUrl },
        childProps: { refresh, projectId: project.id }
      })}
      <EntitiesList
        className="full-width"
        title={t("projects.contributors_header")}
        titleStyle="bar"
        titleTag="h2"
        entityComponent={ContributorRow}
        entityComponentProps={canUpdate ? { onDelete } : null}
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

ProjectCollaboratorsContainer.propTypes = {
  project: PropTypes.object,
  refresh: PropTypes.func.isRequired,
  route: PropTypes.object,
  confirm: PropTypes.func.isRequired
};
