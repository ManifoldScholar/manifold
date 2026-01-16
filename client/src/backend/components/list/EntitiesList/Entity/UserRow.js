import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/entity-thumbnail";
import EntityRow from "./Row";
import Utility from "global/components/utility";
import Checkbox from "../List/bulkActions/Checkbox";
import { useCurrentUser } from "hooks";

function UserRow({
  entity,
  bulkActionsActive,
  bulkSelection,
  addItem,
  removeItem,
  groupAction,
  groupActionIcon,
  memberIds,
  membersView,
  ...props
}) {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();

  const { id, attributes } = entity;

  const isSelected =
    !!bulkSelection?.filters || bulkSelection?.ids?.includes(id);

  const isMember = memberIds?.includes(id);
  const actionId = isMember ? entity.membershipId : id;

  const utility = (
    <button
      className="entity-row__utility-button"
      title={t("reading_groups.remove_member")}
      onClick={() =>
        groupAction(actionId, `${attributes.firstName} ${attributes.lastName}`)
      }
    >
      <Utility.IconComposer icon={groupActionIcon} size={26} />
    </button>
  );

  const additionalProps = {
    title: `${attributes.firstName} ${attributes.lastName}`,
    figure: <EntityThumbnail.User entity={entity} />,
    figureSize: "small",
    figureShape: "circle",
    label: [
      {
        text: t(`records.users.role_options.${attributes.role}`),
        level: ""
      },
      ...(id === currentUser.id
        ? [
            {
              text: t("common.you"),
              level: "notice"
            }
          ]
        : []),
      ...(isMember && !membersView
        ? [
            {
              text: t("member"),
              level: "notice"
            }
          ]
        : [])
    ],
    onRowClick: lh.link("backendRecordsUser", id),
    rowClickMode: groupAction ? "inline" : "block",
    prepend: bulkActionsActive && (
      <Checkbox
        checked={isSelected}
        onSelect={() => addItem(id)}
        onClear={() => removeItem(id)}
      />
    ),
    utility: groupAction && (!isMember || membersView) ? utility : undefined
  };

  return <EntityRow {...props} {...additionalProps} />;
}

UserRow.displayName = "EntitiesList.Entity.UserRow";

UserRow.propTypes = {
  entity: PropTypes.object,
  bulkActionsActive: PropTypes.bool,
  bulkSelection: PropTypes.object,
  addItem: PropTypes.func,
  removeItem: PropTypes.func
};

export default UserRow;
