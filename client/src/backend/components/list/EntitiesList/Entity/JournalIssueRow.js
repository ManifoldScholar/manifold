import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityRow from "./Row";
import EntityThumbnail from "global/components/entity-thumbnail";
import Utility from "global/components/utility";
import { Link } from "react-router-dom";

function JournalIssueRow({
  journal,
  active,
  entity,
  clickable = true,
  ...props
}) {
  const { id, attributes, relationships } = entity;
  const { number, subtitle, projectId } = attributes;

  const meta = relationships.journalVolume
    ? `Volume ${relationships.journalVolume.attributes.number}`
    : "No Volume";

  const additionalProps = {
    title: `Issue ${number}`,
    subtitle,
    meta,
    active: active === id,
    figure: <EntityThumbnail.Project mode="responsive" entity={entity} />,
    utility: (
      <Link
        to={lh.link("backendProject", projectId)}
        className="entity-row__utility-button"
        title="Edit Project"
      >
        <Utility.IconComposer icon="annotate24" size={26} />
      </Link>
    )
  };

  if (clickable) {
    additionalProps.onRowClick = lh.link("backendProject", projectId);
    additionalProps.rowClickMode = "block";
  }

  return <EntityRow {...props} {...additionalProps} rowClickMode="inline" />;
}

JournalIssueRow.propTypes = {
  journal: PropTypes.object.isRequired,
  clickable: PropTypes.bool,
  entity: PropTypes.object,
  active: PropTypes.string
};

export default JournalIssueRow;
