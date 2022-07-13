import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import ThumbnailGrid from "global/components/entity/ThumbnailGrid";
import EntityCollection from "../EntityCollection";
import * as shapes from "../shapes";

function IssuesEntityCollection({
  issues,
  issuesMeta,
  filterProps,
  paginationProps,
  icon = "journals64",
  parentView,
  ...passThroughProps
}) {
  const { t } = useTranslation();

  return (
    <EntityCollection
      icon={icon}
      filterProps={!issuesMeta || !filterProps ? null : filterProps}
      BodyComponent={props => (
        <ThumbnailGrid {...props}>
          {({ stack }) =>
            issues.map(item => (
              <EntityThumbnail
                entity={item}
                stack={stack}
                key={item.id}
                parentView={parentView}
              />
            ))
          }
        </ThumbnailGrid>
      )}
      countProps={
        !issuesMeta
          ? {}
          : {
              pagination: get(issuesMeta, "pagination"),
              unit: t("glossary.issue_truncated", {
                count: issuesMeta?.pagination?.totalCount || 0
              })
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

IssuesEntityCollection.displayName = "Frontend.Entity.Collection.Issues";

IssuesEntityCollection.propTypes = {
  issues: PropTypes.arrayOf(PropTypes.object).isRequired,
  issuesMeta: PropTypes.object.isRequired,
  filterProps: shapes.filters,
  paginationProps: shapes.pagination,
  icon: PropTypes.string
};

export default IssuesEntityCollection;
