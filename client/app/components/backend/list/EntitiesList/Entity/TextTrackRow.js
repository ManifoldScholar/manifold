import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import EntityRow from "./Row";
import Utility from "components/global/utility";

export default function TextTrackRow({
  entity,
  resourceId,
  onDelete,
  ...props
}) {
  const { t } = useTranslation();
  const { attributes, id } = entity;

  const labels = [
    attributes.kind && {
      text: t(`records.tracks.kind_${attributes.kind}`) || attributes.kind
    },
    attributes.srclang && {
      text: attributes.srclang,
      level: "notice"
    }
  ].filter(Boolean);

  const utility = [
    <button
      key="delete"
      className="entity-row__utility-button"
      title={t("actions.delete")}
      onClick={() => onDelete(id)}
    >
      <Utility.IconComposer icon="delete32" size={26} />
    </button>
  ];

  return (
    <EntityRow
      title={attributes.label || t(`records.tracks.kind_${attributes.kind}`)}
      subtitle={attributes.cuesFileName}
      label={labels}
      utility={utility}
      rowClickMode="inline"
      onRowClick={`/backend/projects/resource/${resourceId}/tracks/${id}`}
      {...props}
    />
  );
}

TextTrackRow.displayName = "EntitiesList.Entity.TextTrackRow";

TextTrackRow.propTypes = {
  entity: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired
};
