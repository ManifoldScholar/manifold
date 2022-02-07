import React from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import ThumbnailGrid from "global/components/composed/ThumbnailGrid";
import IssueList from "frontend/components/issue-list";
import EntityCollection from "../EntityCollection";
import * as shapes from "../shapes";

function IssuesEntityCollection({
  issues,
  issuesMeta,
  filterProps,
  paginationProps,
  ...passThroughProps
}) {
  return (
    <EntityCollection
      title="All Journal Issues"
      icon="journals64"
      UtilityComponent={
        !issuesMeta || !filterProps
          ? () => <></>
          : props => <IssueList.Filters {...props} {...filterProps} />
      }
      BodyComponent={props => (
        <ThumbnailGrid {...props}>
          {({ stack }) =>
            issues.map(item => <EntityThumbnail entity={item} stack={stack} />)
          }
        </ThumbnailGrid>
      )}
      countProps={
        !issuesMeta
          ? {}
          : {
              pagination: get(issuesMeta, "pagination"),
              unit: "issue"
            }
      }
      paginationProps={
        !issuesMeta || !paginationProps
          ? {}
          : {
              pagination: get(issuesMeta, "pagination"),
              ...paginationProps
            }
      }
      {...passThroughProps}
    />
  );
}

IssuesEntityCollection.displayName =
  "Frontend.Composed.EntityCollection.Issues";

IssuesEntityCollection.propTypes = {
  issues: PropTypes.arrayOf(PropTypes.object).isRequired,
  issuesMeta: PropTypes.object.isRequired,
  filterProps: shapes.filters,
  paginationProps: shapes.pagination
};

export default IssuesEntityCollection;
