import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityThumbnail from "global/components/entity-thumbnail";
import EntityRow from "./Row";
import FormattedDate from "global/components/FormattedDate";
import { useTranslation } from "react-i18next";

function JournalRow({
  renderWithoutLink,
  listStyle,
  entity: journal,
  figure,
  placeholderMode = "responsive",
  compact = false,
  ...props
}) {
  const { attributes, id } = journal;
  const {
    title,
    titleFormatted,
    journalIssuesCount,
    journalVolumesCount,
    draft,
    updatedAt,
    subtitleFormatted
  } = attributes;

  const { t } = useTranslation();

  const renderFigure = compact
    ? null
    : figure || (
        <EntityThumbnail.Project mode={placeholderMode} entity={journal} />
      );
  const url = renderWithoutLink ? null : lh.link("backendJournal", id);
  const labels = draft ? [t("glossary.draft_title_case_one")] : [];
  const meta = (
    <FormattedDate prefix={t("dates.updated_title_case")} date={updatedAt} />
  );
  const subtitle = compact ? null : (
    <span dangerouslySetInnerHTML={{ __html: subtitleFormatted }} />
  );

  const issuesCount = t("glossary.issue_with_count", {
    count: journalIssuesCount
  });

  const volumesCount = t("glossary.volume_with_count", {
    count: journalVolumesCount
  });

  return (
    <EntityRow
      {...props}
      onRowClick={url}
      rowClickMode="block"
      listStyle={listStyle}
      title={<span dangerouslySetInnerHTML={{ __html: titleFormatted }} />}
      titlePlainText={title}
      subtitle={subtitle}
      count={`${volumesCount}, ${issuesCount}`}
      meta={meta}
      label={labels}
      figure={renderFigure}
    />
  );
}

JournalRow.propTypes = {
  entity: PropTypes.object,
  placeholderMode: PropTypes.string,
  listStyle: PropTypes.oneOf(["rows", "grid"]),
  figure: PropTypes.node,
  compact: PropTypes.bool,
  renderWithoutLink: PropTypes.bool,
  dragHandleProps: PropTypes.object,
  draggableProps: PropTypes.object
};

export default JournalRow;
