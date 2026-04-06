import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { collaboratorsAPI, textsAPI } from "api";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import EntitiesList, {
  Button,
  ContributorRow
} from "backend/components/list/EntitiesList";
import Authorization from "helpers/authorization";
import { useApiCallback } from "hooks";
import withConfirmation from "hoc/withConfirmation";
import { useHistory } from "react-router-dom";

function TextCollaboratorsContainer({ text, refresh, route, confirm }) {
  const { t } = useTranslation();
  const history = useHistory();

  const closeUrl = lh.link("backendTextCollaborators", text.id);

  const auth = new Authorization();
  const canUpdate = auth.authorizeAbility({
    entity: text.relationships.project,
    ability: "updateMakers"
  });

  const destroyCollaborator = useApiCallback(collaboratorsAPI.destroy);

  const onDelete = useCallback(
    makerId => {
      const heading = t("modals.remove_contributor");
      if (confirm)
        confirm(heading, null, async () => {
          await destroyCollaborator("texts", text.id, { maker: makerId });
          refresh();
        });
    },
    [text.id, confirm, destroyCollaborator, t, refresh]
  );

  const updateText = useApiCallback(textsAPI.update);

  const onReorder = async (_change, flattenedCollaborators) => {
    const data = flattenedCollaborators
      .map(fc =>
        fc.attributes.collaborators.map(c => ({
          id: c,
          type: "collaborators"
        }))
      )
      .flat();

    const { errors } = await updateText(text.id, {
      attributes: {},
      relationships: { collaborators: { data } }
    });

    if (errors) {
      if (refresh) refresh();
    }
  };

  const onEdit = id => {
    history.push(lh.link("backendTextCollaboratorEdit", text.id, id));
  };

  return (
    <section>
      {childRoutes(route, {
        drawer: true,
        drawerProps: { closeUrl },
        childProps: { refresh, textId: text.id }
      })}
      <EntitiesList
        className="full-width"
        title={t("projects.contributors_header")}
        titleStyle="bar"
        titleTag="h2"
        callbacks={{ onReorder }}
        sortableStyle="tight"
        entityComponent={ContributorRow}
        entityComponentProps={canUpdate ? { onDelete, onEdit } : null}
        entities={text?.relationships?.flattenedCollaborators ?? []}
        buttons={
          canUpdate
            ? [
                <Button
                  path={lh.link("backendTextCollaboratorNew", text.id)}
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

export default withConfirmation(TextCollaboratorsContainer);

TextCollaboratorsContainer.displayName = "Text.Collaborators";

TextCollaboratorsContainer.propTypes = {
  text: PropTypes.object,
  refresh: PropTypes.func.isRequired,
  route: PropTypes.object,
  confirm: PropTypes.func.isRequired
};
