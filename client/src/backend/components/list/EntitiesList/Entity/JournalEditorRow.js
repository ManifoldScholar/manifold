import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import EntityThumbnail from "global/components/entity-thumbnail";
import EntityRow from "./Row";
import Utility from "global/components/utility";
import { useCurrentUser } from "hooks";

function JournalEditorRow({ entity, handleDelete, ...props }) {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();

  const { id, attributes } = entity;

  const utility = (
    <button
      className="entity-row__utility-button"
      onClick={() => handleDelete(id)}
      title={t("actions.delete")}
    >
      <Utility.IconComposer icon="delete32" size={26} />
    </button>
  );

  const additionalProps = {
    title: `${attributes.firstName} ${attributes.lastName}`,
    figure: <EntityThumbnail.User entity={entity} />,
    figureSize: "small",
    figureShape: "circle",
    label:
      id === currentUser.id
        ? [
            {
              text: t("common.you"),
              level: "notice",
            },
          ]
        : [],
    utility,
  };

  return <EntityRow {...props} {...additionalProps} />;
}

JournalEditorRow.displayName = "EntitiesList.Entity.UserRow";

JournalEditorRow.propTypes = {
  entity: PropTypes.object,
};

export default JournalEditorRow;
