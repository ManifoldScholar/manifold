import React from "react";
import { build, storiesOf } from "helpers/storybook/exports";
import Searchable from "backend/components/list/Searchable";
import UserListItem from "backend/components/user/ListItem";
import FeatureListItem from "backend/components/feature/ListItem";
import ProjectListItem from "backend/components/project/ListItem";
import EventListItem from "backend/components/event/ListItem";
import ResourceCollectionListItem from "backend/components/resource-collection/ListItem";
import NotationResourceListItem from "reader/components/notation/resource/PickerListItem";
import ProjectCollection from "backend/components/project-collection";
import List from "../index";

const projectCollection = build.entity.projectCollection();
const users = build.arrayOf.users(8);
const projects = build.arrayOf.projects(6);
const features = build.arrayOf.type("features", 6);
const events = build.arrayOf.type("events", 6);
const resourceCollections = build.arrayOf.type("resourceCollections", 6);
const resources = build.arrayOf.type("resources", 6);

const pagination = {
  perPage: 20,
  currentPage: 1,
  nextPage: 2,
  prevPage: 0,
  totalPages: 2,
  totalCount: 32
};
const fakeHandler = () => {};

storiesOf("Reader/List/Searchable", module).add("Notation Picker", () => {
  return (
    <List.Searchable
      entities={resources}
      singularUnit={"resource"}
      pluralUnit={"resources"}
      pagination={pagination}
      paginationClickHandler={fakeHandler}
      paginationClass="secondary"
      entityComponent={NotationResourceListItem}
      filterChangeHandler={fakeHandler}
      paginationPadding={2}
      entityComponentProps={{
        selectionHandler: fakeHandler
      }}
    />
  );
});

storiesOf("Backend/List/Searchable", module)
  .add("Basic", () => {
    return <Searchable entities={users} entityComponent={UserListItem} />;
  })

  .add("Admin Dashboard", () => {
    return (
      <div className="backend-dashboard">
        <Searchable
          newButton={{
            text: "Add a New Project",
            path: "/foo",
            authorizedFor: "project",
            authorizedTo: "create"
          }}
          showEntityCount={false}
          initialFilter={{ filter: {} }}
          defaultFilter={{ order: "sort_title ASC" }}
          listClassName="project-list"
          entities={projects}
          pagination={pagination}
          paginationClickHandler={fakeHandler}
          paginationClass="secondary"
          entityComponent={ProjectListItem}
          entityComponentProps={{ placeholderMode: "small" }}
          filterChangeHandler={fakeHandler}
        />
      </div>
    );
  })

  .add("Author Dashboard", () => {
    return (
      <List.Searchable
        entities={projects}
        singularUnit="project"
        pluralUnit="projects"
        pagination={pagination}
        paginationClickHandler={fakeHandler}
        paginationClass="secondary"
        entityComponent={ProjectListItem}
        filterChangeHandler={fakeHandler}
      />
    );
  })

  .add("Features", () => {
    return (
      <List.Searchable
        newButton={{
          path: "/features/new",
          text: "Create a new feature",
          authorizedFor: "feature"
        }}
        entities={features}
        entityComponent={FeatureListItem}
        singularUnit="feature"
        pluralUnit="features"
      />
    );
  })

  .add("Events", () => {
    return (
      <List.Searchable
        entities={events}
        singularUnit="event"
        pluralUnit="events"
        listClassName="vertical-list-primary tile-list"
        pagination={pagination}
        paginationClickHandler={fakeHandler}
        paginationClass="secondary"
        entityComponent={EventListItem}
        filterChangeHandler={fakeHandler}
        destroyHandler={fakeHandler}
        filterOptions={{
          type: {
            options: [],
            labels: []
          }
        }}
      />
    );
  })

  .add("Project Grid A", () => {
    return (
      <List.Searchable
        newButton={{
          path: "/projects/new",
          text: "Add a New Project",
          authorizedFor: "project"
        }}
        columnarNav
        showEntityCount={false}
        initialFilter={{ filter: {} }}
        defaultFilter={{ order: "sort_title ASC" }}
        listClassName="project-list grid"
        entities={projects}
        entityComponent={ProjectListItem}
        singularUnit="project"
        pluralUnit="projects"
        pagination={pagination}
        paginationClickHandler={fakeHandler}
        paginationClass="secondary"
        filterChangeHandler={fakeHandler}
        filterOptions={{
          draft: {
            options: [true, false],
            labels: {
              true: "Show Draft Projects",
              false: "Hide Draft Projects"
            }
          }
        }}
        sortOptions={[{ label: "title", value: "sort_title" }]}
      />
    );
  })

  .add("Project Grid B", () => {
    const cover = props => {
      const entity = props.entity;
      if (!entity) return null;

      return (
        <li key={entity.id}>
          <ProjectCollection.ProjectCover
            removeHandler={fakeHandler}
            addHandler={fakeHandler}
            {...props}
          />
        </li>
      );
    };

    return (
      <List.Searchable
        defaultFilter={{ order: "sort_title ASC" }}
        listClassName="project-list grid"
        entities={projects}
        entityComponent={cover}
        entityComponentProps={{
          projectCollection,
          addable: true
        }}
        singularUnit="project"
        pluralUnit="projects"
        showEntityCount={false}
        pagination={pagination}
        filterChangeHandler={fakeHandler}
        paginationClickHandler={fakeHandler}
        compactPagination
      />
    );
  })

  .add("Res. Collections", () => {
    return (
      <List.Searchable
        newButton={{
          path: "resources-collection/new",
          text: "Add a New Resource Collection",
          authorizedFor: projects[0],
          authorizedTo: "update"
        }}
        entities={resourceCollections}
        singularUnit="resource collection"
        pluralUnit="resource collections"
        pagination={pagination}
        paginationClickHandler={fakeHandler}
        paginationClass="secondary"
        entityComponent={ResourceCollectionListItem}
        filterChangeHandler={fakeHandler}
        sortOptions={[{ label: "title", value: "title" }]}
      />
    );
  });
