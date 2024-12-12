import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/entity-thumbnail";
import EntityRow from "./Row";
import Checkbox from "../List/bulkActions/Checkbox";
import { useCurrentUser } from "hooks";

function UserRow({
  entity,
  bulkActionsActive,
  bulkSelection,
  addItem,
  removeItem,
  ...props
}) {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();

  const { id, attributes } = entity;

  const isSelected =
    !!bulkSelection?.filters || bulkSelection?.ids?.includes(id);

  const additionalProps = {
    title: `${attributes.firstName} ${attributes.lastName}`,
    figure: <EntityThumbnail.User entity={entity} />,
    figureSize: "small",
    figureShape: "circle",
    label: [
      { text: t(`records.users.role_options.${attributes.role}`), level: "" },
      ...(id === currentUser.id
        ? [
            {
              text: t("common.you"),
              level: "notice"
            }
          ]
        : [])
    ],
    onRowClick: lh.link("backendRecordsUser", id),
    rowClickMode: "block",
    prepend: bulkActionsActive && (
      <Checkbox
        checked={isSelected}
        onSelect={() => addItem(id)}
        onClear={() => removeItem(id)}
      />
    )
  };

  return <EntityRow {...props} {...additionalProps} />;
}

UserRow.displayName = "EntitiesList.Entity.UserRow";

UserRow.propTypes = {
  entity: PropTypes.object,
  currentUserId: PropTypes.string
};

export default UserRow;
