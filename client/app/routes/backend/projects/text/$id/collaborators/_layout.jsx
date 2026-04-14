import { useTranslation } from "react-i18next";
import { useOutletContext, useNavigate, useRevalidator } from "react-router";
import { collaboratorsAPI, textsAPI } from "api";
import OutletWithDrawers from "components/global/router/OutletWithDrawers";
import EntitiesList, {
  Button,
  ContributorRow
} from "components/backend/list/EntitiesList";
import Authorization from "helpers/authorization";
import Dialog from "components/global/dialog";
import { useApiCallback } from "hooks";
import useConfirmation from "hooks/useConfirmation";

const authorization = new Authorization();

export default function TextCollaboratorsLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const text = useOutletContext();
  const { revalidate } = useRevalidator();
  const { confirm, confirmation } = useConfirmation();

  const closeUrl = `/backend/projects/text/${text.id}/collaborators`;

  const canUpdate = authorization.authorizeAbility({
    entity: text?.relationships?.project,
    ability: "updateMakers"
  });

  const destroyCollaborator = useApiCallback(collaboratorsAPI.destroy);
  const updateText = useApiCallback(textsAPI.update);

  const onDelete = makerId => {
    confirm({
      heading: t("modals.remove_contributor"),
      callback: async closeDialog => {
        await destroyCollaborator("texts", text.id, { maker: makerId });
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

    const { errors } = await updateText(text.id, {
      attributes: {},
      relationships: { collaborators: { data } }
    });

    if (errors) {
      revalidate();
    }
  };

  const onEdit = id => {
    navigate(`/backend/projects/text/${text.id}/collaborators/${id}`);
  };

  return (
    <section>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <OutletWithDrawers drawerProps={{ closeUrl }} context={text} />
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
                  path={`/backend/projects/text/${text.id}/collaborators/new`}
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
