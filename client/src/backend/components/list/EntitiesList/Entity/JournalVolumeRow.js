import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityRow from "./Row";
import EntityThumbnail from "global/components/entity-thumbnail";

function JournalVolumeRow({
  journal,
  active,
  entity,
  clickable = true,
  ...props
}) {
  const { id, attributes } = entity;
  const { number, subtitle, journalIssuesCount } = attributes;
  const issuesLabel = journalIssuesCount === 1 ? "Issue" : "Issues";

  const additionalProps = {
    title: `Volume ${number}`,
    subtitle,
    active: active === id,
    count: `${journalIssuesCount} ${issuesLabel}`,
    figure: <EntityThumbnail.JournalVolume />
  };

  if (clickable) {
    additionalProps.onRowClick = lh.link(
      "backendJournalVolumeEdit",
      journal.id,
      id
    );
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
