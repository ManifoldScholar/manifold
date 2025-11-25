import { useTranslation } from "react-i18next";
import { useOutletContext, useNavigate } from "react-router-dom";
import { collaboratorsAPI, textsAPI } from "api";
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

function TextCollaboratorsContainer({ confirm }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { text, refresh } = useOutletContext() || {};

  const closeUrl = lh.link("backendTextCollaborators", text?.id);

  const canUpdate = authorization.authorizeAbility({
    entity: text?.relationships?.project,
    ability: "updateMakers"
  });

  const destroyCollaborator = useApiCallback(collaboratorsAPI.destroy);
  const updateText = useApiCallback(textsAPI.update);

  const onDelete = makerId => {
    const heading = t("modals.remove_contributor");
    if (confirm)
      confirm(heading, null, async () => {
        await destroyCollaborator("texts", text.id, { maker: makerId });
        if (refresh) refresh();
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

    const { errors } = await updateText(text.id, {
      attributes: {},
      relationships: { collaborators: { data } }
    });

    if (errors) {
      if (refresh) refresh();
    }
  };

  const onEdit = id => {
    navigate(lh.link("backendTextCollaboratorEdit", text.id, id));
  };

  if (!text) return null;

  return (
    <section>
      <OutletWithDrawer
        drawerProps={{ closeUrl }}
        context={{ refresh, textId: text.id }}
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

TextCollaboratorsContainer.displayName = "Text.Collaborators";

export default withConfirmation(TextCollaboratorsContainer);
