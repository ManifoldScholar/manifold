import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import EntityCollection from "..";

const ENTITY_COUNT = 8;
const FILTER_PROPS = {
  filterChangeHandler: () => {},
  initialFilterState: {},
  resetFilterState: {}
};
const PAGINATION_PROPS = {
  paginationClickHandler: () => {}
};
const ENTITIES_META = {
  pagination: {
    perPage: ENTITY_COUNT,
    currentPage: 1,
    nextPage: 2,
    prevPage: 0,
    totalPages: 4,
    totalCount: 25
  }
};

const projects = fixtures.collectionFactory("project", ENTITY_COUNT);
const collectionProjects = fixtures.collectionFactory(
  "collectionProject",
  ENTITY_COUNT
);

storiesOf("Frontend/EntityCollection", module)
  .add("Projects", () => (
    <EntityCollection.Projects
      projects={projects}
      projectsMeta={ENTITIES_META}
      filterProps={FILTER_PROPS}
      paginationProps={PAGINATION_PROPS}
      bgColor="neutral05"
    />
  ))
  .add("Project Collection Summary", () => (
    <EntityCollection.ProjectCollectionSummary
      projectCollection={fixtures.factory("projectCollection", {
        relationships: { collectionProjects }
      })}
      limit={4}
      bgColor="neutral05"
    />
  ))
  .add("Project Resource Collections", () => (
    <EntityCollection.ProjectResourceCollections
      resourceCollections={fixtures.collectionFactory("resourceCollection", 2)}
    />
  ))
  .add("Project Resources", () => {
    const project = fixtures.factory("project");
    const resourceOptionCreator = () => {
      return {
        relationships: {
          project: fixtures.factory("project")
        }
      };
    };
    return (
      <EntityCollection.ProjectResources
        project={project}
        resources={fixtures.collectionFactory(
          "resource",
          4,
          resourceOptionCreator
        )}
      />
    );
  });
