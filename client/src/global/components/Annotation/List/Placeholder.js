import React from "react";
import PropTypes from "prop-types";
import ContentPlaceholder from "global/components/ContentPlaceholder";

function getIcon(isGroup) {
  if (isGroup) return "readingGroup24";
  return "notes24";
}

function getTitle(isGroup, isFiltered) {
  if (isFiltered) return "No annotations matched your search criteria.";
  return isGroup
    ? "Be the first reader to annotate in this group!"
    : "Create your first annotation!";
}

function getBody(isGroup, isFiltered) {
  if (isGroup) {
    return isFiltered
      ? "Consider removing the text or member filter above to see more annotations."
      : "While reading, you can associate a new or existing annotation with this group.";
  }

  return isFiltered
    ? "Consider removing the text filter above to see more annotations."
    : "While reading, add your notes and annotations to the text. Save them privately, or associate them with a reading group.";
}

function AnnotationListPlaceholder({ isGroup, isFiltered }) {
  const title = getTitle(isGroup, isFiltered);
  const body = getBody(isGroup, isFiltered);
  const icon = getIcon(isGroup);

  return (
    <ContentPlaceholder.Wrapper context="frontend">
      <ContentPlaceholder.Title icon={icon}>{title}</ContentPlaceholder.Title>
      <ContentPlaceholder.Body>
        <p>{body}</p>
      </ContentPlaceholder.Body>
      {!isFiltered && <ContentPlaceholder.Actions />}
    </ContentPlaceholder.Wrapper>
  );
}

AnnotationListPlaceholder.displayName = "Annotation.List.Placeholder";

AnnotationListPlaceholder.propTypes = {
  isGroup: PropTypes.bool,
  isFiltered: PropTypes.bool
};

export default AnnotationListPlaceholder;
