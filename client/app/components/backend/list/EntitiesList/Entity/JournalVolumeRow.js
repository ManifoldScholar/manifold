import React from "react";
import PropTypes from "prop-types";

import EntityRow from "./Row";
import EntityThumbnail from "components/global/entity-thumbnail";
import { useTranslation } from "react-i18next";

function JournalVolumeRow({
  journal,
  active,
  entity,
  clickable = true,
  ...props
}) {
  const { id, attributes } = entity;
  const { number, subtitle, journalIssuesCount } = attributes;
  const { t } = useTranslation();

  const additionalProps = {
    title: t("journals.volume_number", { volNum: number }),
    subtitle,
    active: active === id,
    count: t("glossary.issue_with_count", { count: journalIssuesCount }),
    figure: <EntityThumbnail.JournalVolume />
  };

  if (clickable) {
    additionalProps.onRowClick = `/backend/journals/${journal.id}/volumes/${id}`;
    additionalProps.rowClickMode = "block";
  }

  return <EntityRow {...props} {...additionalProps} />;
}

JournalVolumeRow.propTypes = {
  journal: PropTypes.object.isRequired,
  clickable: PropTypes.bool,
  entity: PropTypes.object,
  active: PropTypes.string
};

export default JournalVolumeRow;
