import React from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import ThumbnailGrid from "global/components/entity/ThumbnailGrid";
import EntityCollection from "../EntityCollection";
import * as shapes from "../shapes";

function ProjectsEntityCollection({
  projects,
  meta,
  filterProps,
  paginationProps,
  ...passThroughProps
}) {
  const { t } = useTranslation();

  const showPagination = !isEmpty(meta) && !isEmpty(paginationProps);
  const showFilters = !isEmpty(meta) && !isEmpty(filterProps);
  return (
    <EntityCollection
      title={t("pages.projects_all")}
      icon="projects64"
      filterProps={showFilters ? filterProps : null}
      BodyComponent={props => (
        <ThumbnailGrid {...props}>
          {({ stack }) =>
            projects.map(item => (
              <EntityThumbnail key={item.id} entity={item} stack={stack} />
            ))
          }
        </ThumbnailGrid>
      )}
      countProps={
        isEmpty(meta)
          ? {}
          : {
              pagination: get(meta, "pagination"),
              unit: t("glossary.project", {
                count: meta?.pagination?.totalCount || 0
              })
            }
      }
      paginationProps={
        !showPagination
          ? {}
          : {
              pagination: get(meta, "pagination"),
              ...paginationProps
            }
      }
      {...passThroughProps}
    />
  );
}

ProjectsEntityCollection.displayName = "Frontend.Entity.Collection.Projects";

ProjectsEntityCollection.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  meta: PropTypes.object,
  filterProps: shapes.filters,
  paginationProps: shapes.pagination
};

export default ProjectsEntityCollection;
