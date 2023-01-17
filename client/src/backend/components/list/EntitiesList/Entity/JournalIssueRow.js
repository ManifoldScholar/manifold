import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityRow from "./Row";
import EntityThumbnail from "global/components/entity-thumbnail";
import { useTranslation } from "react-i18next";

function JournalIssueRow({
  journal,
  active,
  entity,
  clickable = true,
  ...props
}) {
  const { id, attributes, relationships } = entity;
  const { number, subtitle, projectId } = attributes;
  const { t } = useTranslation();

  const meta = relationships.journalVolume
    ? t("journals.volume_number", {
        volNum: relationships.journalVolume.attributes.number
      })
    : t("volumes.no_volume");

  const additionalProps = {
    title: t("journals.issue_number", { issNum: number }),
    subtitle,
    meta,
    active: active === id,
    figure: <EntityThumbnail.Project mode="responsive" entity={entity} />
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
