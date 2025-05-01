import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityRow from "./Row";
import Utility from "global/components/utility";
import { useTranslation } from "react-i18next";

function ReadingGroupMembershipRow({ active, entity, onDelete, ...props }) {
  const { id, attributes, relationships } = entity;

  const { t } = useTranslation();

  const { readingGroup } = relationships;
  const { role, name } = attributes;

  const meta = `${attributes.annotationsCount} ${t("glossary.annotation", {
    count: attributes.annotationsCount,
  })} | ${attributes.highlightsCount} ${t("glossary.highlight", {
    count: attributes.highlightsCount,
  })} | ${attributes.commentsCount} ${t("glossary.comment", {
    count: attributes.commentsCount,
  })}`;

  const additionalProps = {
    title: readingGroup.attributes.name,
    subtitle: role,
    meta,
    label: [
      ...(readingGroup.attributes.privacy === "public"
        ? [
            {
              text: t("common.public"),
              level: "notice",
            },
          ]
        : []),
    ],
    active: active === id,
    onRowClick: lh.link("backendReadingGroupMembers", readingGroup.id),
    rowClickMode: "inline",
  };

  const utility = (
    <button
      className="entity-row__utility-button"
      title={t("reading_groups.remove_member")}
      onClick={() => onDelete(id, name, readingGroup.attributes.name)}
    >
      <Utility.IconComposer icon="circleMinus24" size={26} />
    </button>
  );

  return <EntityRow utility={utility} {...props} {...additionalProps} />;
}

ReadingGroupMembershipRow.propTypes = {
  entity: PropTypes.object,
  active: PropTypes.string,
  onDelete: PropTypes.func,
};

export default ReadingGroupMembershipRow;
