import React from "react";
import PropTypes from "prop-types";
import EntityCollection from "../EntityCollection";
import Journal from "frontend/components/journal";

function JournalIssuesEntityCollection({
  journal,
  issues,
  meta,
  paginationProps,
  ...passThroughProps
}) {
  if (!journal || !issues?.length) return null;

  return (
    <EntityCollection
      headerLayout="title_only"
      BodyComponent={() => (
        <Journal.IssueList journal={journal} issues={issues} />
      )}
      countProps={
        !meta
          ? {}
          : {
              pagination: meta.pagination,
              unit: "issue"
            }
      }
      paginationProps={
        !meta || !paginationProps
          ? {}
          : {
              pagination: meta.pagination,
              ...paginationProps
            }
      }
      {...passThroughProps}
    />
  );
}

JournalIssuesEntityCollection.displayName =
  "Frontend.Composed.EntityCollection.JournalIssues";

JournalIssuesEntityCollection.propTypes = {
  journal: PropTypes.object,
  issues: PropTypes.array,
  meta: PropTypes.object,
  paginationProps: PropTypes.object,
  countProps: PropTypes.object,
  title: PropTypes.string,
  FooterComponent: PropTypes.func
};

export default JournalIssuesEntityCollection;
