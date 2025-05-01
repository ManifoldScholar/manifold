import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { collaboratorsAPI, projectsAPI } from "api";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import EntitiesList, {
  Button,
  ContributorRow,
} from "backend/components/list/EntitiesList";
import Authorization from "helpers/authorization";
import { useApiCallback } from "hooks";
import withConfirmation from "hoc/withConfirmation";
import Form from "global/components/form";

function ProjectCollaboratorsContainer({ project, refresh, route, confirm }) {
  const { t } = useTranslation();

  const closeUrl = lh.link("backendProjectCollaborators", project.id);

  const auth = new Authorization();
  const canUpdate = auth.authorizeAbility({
    entity: project,
    ability: "updateMakers",
  });

  const destroyCollaborator = useApiCallback(collaboratorsAPI.destroy);

  const onDelete = useCallback(
    (makerId) => {
      const heading = t("modals.remove_contributor");
      if (confirm)
        confirm(heading, null, async () => {
          await destroyCollaborator("projects", project.id, { maker: makerId });
          refresh();
        });
    },
    [project.id, confirm, destroyCollaborator, t, refresh],
  );

  const [ordered, setOrdered] = useState([]);

  const onReorder = (_change, flattenedCollaborators) => {
    const update = flattenedCollaborators.map((fc, i) => ({
      id: fc.id,
      position: i + 1,
      collaborators: fc.attributes.collaborators,
    }));
    setOrdered(update);
  };

  const updateProject = useApiCallback(projectsAPI.update);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!ordered.length) return;

    const data = ordered
      .map((fc) => {
        const collaborators = fc.collaborators.map((c) => ({
          id: c,
          type: "collaborators",
        }));
        return collaborators;
      })
      .flat();

    const { errors } = await updateProject(project.id, {
      attributes: {},
      relationships: { collaborators: { data } },
    });

    if (errors) {
      if (refresh) refresh();
    }
  };

  return (
    <section>
      {childRoutes(route, {
        drawer: true,
        drawerProps: { closeUrl },
        childProps: { refresh, projectId: project.id },
      })}
      <form
        onSubmit={onSubmit}
        method="post"
        className="backend form-secondary"
      >
        <EntitiesList
          className="full-width"
          title={t("projects.contributors_header")}
          titleStyle="bar"
          titleTag="h2"
          callbacks={{ onReorder }}
          sortableStyle="tight"
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
                  />,
                ]
              : []
          }
        />
        <Form.Save marginTop />
      </form>
    </section>
  );
}

export default withConfirmation(ProjectCollaboratorsContainer);

ProjectCollaboratorsContainer.displayName = "Project.Collaborators";

ProjectCollaboratorsContainer.propTypes = {
  project: PropTypes.object,
  refresh: PropTypes.func.isRequired,
  route: PropTypes.object,
  confirm: PropTypes.func.isRequired,
};
