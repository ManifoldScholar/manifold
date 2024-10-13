import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/entity-thumbnail";
import EntityRow from "./Row";
import Utility from "global/components/utility";
import { useTranslation } from "react-i18next";

export default function ReadingGroupMemberRow({
  entity,
  active,
  onDelete,
  ...props
}) {
  const { t } = useTranslation();

  const { attributes, relationships, id } = entity;

  const { user } = relationships;
  const { name } = attributes;

  const meta = `${attributes.annotationsCount} ${t("glossary.annotation", {
    count: attributes.annotationsCount
  })} | ${attributes.highlightsCount} ${t("glossary.highlight", {
    count: attributes.highlightsCount
  })} | ${attributes.commentsCount} ${t("glossary.comment", {
    count: attributes.commentsCount
  })}`;

  const utility = (
    <>
      <button
        className="entity-row__utility-button"
        title={t("reading_groups.remove_member")}
        onClick={() => onDelete(id, name)}
      >
        <Utility.IconComposer icon="close32" size={26} />
      </button>
    </>
  );

  return (
    <EntityRow
      {...props}
      onRowClick={lh.link("backendRecordsUser", user.id)}
      rowClickMode="inline"
      title={name}
      subtitle={meta}
      figure={<EntityThumbnail.User entity={user} />}
      figureSize={"small"}
      figureShape={"circle"}
      label={
        attributes.role
          ? t(`reading_groups.role_options.${attributes.role}`)
          : null
      }
      active={active === id}
      utility={utility}
    />
  );
}

ReadingGroupMemberRow.displayName = "EntitiesList.Entity.ReadingGroupMemberRow";

ReadingGroupMemberRow.propTypes = {
  entity: PropTypes.object,
  currentUserId: PropTypes.string,
  active: PropTypes.string,
  t: PropTypes.func
};
