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

  const showFilters = !isEmpty(meta) && !isEmpty(filterProps);
  return (
    <EntityCollection
      title={t("titles.projects")}
      icon="projects64"
      filterProps={showFilters ? filterProps : null}
      BodyComponent={props => (
        <ThumbnailGrid isList={projects.length > 1} {...props}>
          {({ stack }) =>
            projects.map(item => (
              <EntityThumbnail
                key={item.id}
                entity={item}
                stack={stack}
                isListItem={projects.length > 1}
              />
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
        isEmpty(meta)
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
