import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import EntityRow from "backend/components/list/EntitiesList/Entity/Row";
import EntitiesList, {
  Button,
  Search,
  EventRow,
  FeatureRow,
  LogRow,
  MakerRow,
  PageRow,
  PermissionRow,
  ProjectRow,
  ResourceRow,
  ResourceCollectionRow,
  SubjectRow,
  TwitterQueryRow,
  UserRow
} from "backend/components/list/EntitiesList";
import { text } from "@storybook/addon-knobs";

const users = fixtures.collectionFactory("user", 8);
const makers = fixtures.collectionFactory("maker", 8);
const projects = fixtures.collectionFactory("project", 6);
const features = fixtures.collectionFactory("feature", 6);
const pages = fixtures.collectionFactory("page", 6);
const events = fixtures.collectionFactory("event", 6);
const resourceCollections = fixtures.collectionFactory("resourceCollection", 6);
const resources = fixtures.collectionFactory("resource", 6);
const twitterQueries = fixtures.collectionFactory("twitterQuery", 6);
const subjects = fixtures.collectionFactory("subject", 6);
const permissions = fixtures.collectionFactory(
  "permission",
  6,
  (type, index) => ({
    id: `${type}-${index}`,
    relationships: {
      user: fixtures.factory("user"),
      resource: fixtures.factory("project")
    }
  })
);
const versions = fixtures.collectionFactory("version", 6);
const pagination = fixtures.pagination();

const fourFilters = [
  {
    label: "Published State",
    key: "draft",
    options: [
      {
        label: "Draft Projects",
        value: true
      },
      {
        label: "Published Projects",
        value: false
      }
    ]
  },
  {
    label: "Category",
    key: "category",
    options: [
      {
        label: "Movies",
        value: "movies"
      },
      {
        label: "Books",
        value: "books"
      }
    ]
  },
  {
    label: "Age",
    key: "age",
    options: [
      {
        label: "> 6 months",
        value: "more"
      },
      {
        label: "< 6 months",
        value: "less"
      }
    ]
  },
  {
    label: "Glorp",
    key: "glorp",
    options: [
      {
        label: "Bananas",
        value: "bananas"
      },
      {
        label: "Peaches",
        value: "peaches"
      }
    ]
  }
];
const threeFilters = fourFilters.slice(0);
threeFilters.pop();
const twoFilters = threeFilters.slice(0);
twoFilters.pop();
const oneFilter = twoFilters.slice(0);
oneFilter.pop();

const sortOptions = [
  {
    label: "Title",
    value: "sort_title"
  }
];

const fakeHandler = () => {};
const callbacks = {
  onPageClick: fakeHandler,
  onSearchChange: fakeHandler
};

storiesOf("Backend/List/Entities", module)
  .add("Users", () => {
    return (
      <EntitiesList
        title={"A List of Users"}
        entities={users}
        entityComponent={UserRow}
        showCount
        unit="resource"
        pagination={pagination}
        callbacks={callbacks}
        buttons={[<Button path="/foo" text="Add a new user" type="add" />]}
        search={
          <Search
            filters={threeFilters}
            sortOptions={sortOptions}
            onChange={callbacks.onSearchChange}
          />
        }
      />
    );
  })

  .add("TwitterQueries", () => {
    return (
      <EntitiesList
        title={"Twitter Queries"}
        titleIcon={"activityTweet64"}
        titleStyle={"section"}
        instructions={
          "Manifold will periodically fetch tweets according to the queries specified below."
        }
        entities={twitterQueries}
        showCountInTitle
        callbacks={callbacks}
        buttons={[<Button path="/foo" text="Add New Query" type="add" />]}
        entityComponent={TwitterQueryRow}
        search={
          <Search
            filters={threeFilters}
            sortOptions={sortOptions}
            onChange={callbacks.onSearchChange}
          />
        }
      />
    );
  })

  .add("Subjects", () => {
    return (
      <EntitiesList
        title={"Project Subjects"}
        titleStyle="bar"
        entities={subjects}
        entityComponent={SubjectRow}
        pagination={pagination}
        callbacks={callbacks}
        search={
          <Search filters={twoFilters} onChange={callbacks.onSearchChange} />
        }
        buttons={[<Button path="/foo" text="Add New Subject" type="add" />]}
      />
    );
  })

  .add("Res. Collections", () => {
    return (
      <EntitiesList
        title={"Resource Collections"}
        titleIcon="resourceCollection64"
        entities={resourceCollections}
        entityComponent={ResourceCollectionRow}
      />
    );
  })

  .add("Resources", () => {
    return (
      <EntitiesList
        title={"Resources"}
        titleIcon="resources64"
        entities={resources}
        pagination={pagination}
        callbacks={callbacks}
        showCount
        unit="resource"
        entityComponent={ResourceRow}
        buttons={[
          <Button path="/foo" text="Add New Resource" type="add" />,
          <Button path="/foo" text="Bulk Import Resources" icon="resource24" />
        ]}
      />
    );
  })

  .add("Projects", () => {
    return (
      <EntitiesList
        title={"Projects"}
        titleIcon="BEProject64"
        entities={projects}
        entityComponent={ProjectRow}
        pagination={pagination}
        showCount
        showCountInTitle
        unit="project"
        search={
          <Search
            filters={threeFilters}
            sortOptions={sortOptions}
            onChange={callbacks.onSearchChange}
          />
        }
        buttons={[
          <Button path="/foo" text="Add New Project" type="add" />,
          <Button path="/foo" text="Bulk Import Projects" icon="resource24" />
        ]}
        callbacks={callbacks}
      />
    );
  })

  .add("Projects Grid", () => {
    return (
      <EntitiesList
        title="Projects"
        titleIcon="BEProject64"
        titleStyle="bar"
        listStyle="grid"
        entities={projects}
        entityComponent={ProjectRow}
        pagination={pagination}
        paginationStyle="compact"
        showCount
        showCountInTitle
        unit="Project"
        callbacks={callbacks}
        buttons={[
          <Button path="/foo" text="Add New Project" type="add" />,
          <Button path="/foo" text="Bulk Import Projects" icon="resource24" />
        ]}
      />
    );
  })

  .add("Permissions", () => {
    return (
      <EntitiesList
        title={"Permissions"}
        entities={permissions}
        entityComponent={PermissionRow}
        entityComponentProps={{
          linkName: "backendProjectPermission"
        }}
      />
    );
  })

  .add("Pages", () => {
    return (
      <EntitiesList
        title={"Pages"}
        titleIcon="resourceDocument64"
        entities={pages}
        entityComponent={PageRow}
        search={
          <Search
            filters={threeFilters}
            sortOptions={sortOptions}
            onChange={callbacks.onSearchChange}
          />
        }
      />
    );
  })

  .add("Makers", () => {
    return (
      <EntitiesList
        title={"Makers"}
        titleIcon="avatar64"
        entities={makers}
        entityComponent={MakerRow}
      />
    );
  })

  .add("Log", () => {
    return (
      <EntitiesList
        title={"Log"}
        titleIcon="BEActivity64"
        entities={versions}
        entityComponent={LogRow}
      />
    );
  })

  .add("Features", () => {
    const toggle = (event, feature) => {
      const toChange = features.find(f => f.id === feature.id);
      if (!toChange) return null;

      return (toChange.attributes.live = !toChange.attributes.live);
    };

    return (
      <EntitiesList
        title={"Features"}
        titleStyle="bar"
        entities={features}
        entityComponent={FeatureRow}
        entityComponentProps={{
          onSwitchChange: toggle
        }}
      />
    );
  })

  .add("Activity", () => {
    return (
      <EntitiesList
        title={"Activity"}
        titleIcon={"BEActivity64"}
        listStyle="tiles"
        entities={events}
        entityComponent={EventRow}
      />
    );
  })

  .add("Empty", () => {
    const message = text("Message", null);

    return (
      <EntitiesList
        title={"Empty List"}
        entities={[]}
        emptyMessage={message}
        entityComponent={() => null}
      />
    );
  })

  /* eslint-disable no-console */
  .add("Custom Row", () => {
    return (
      <EntitiesList
        instructions={"This list generates rows using an arrow function."}
        title={"A Custom List"}
        entities={users}
        entityComponent={props => {
          const { entity } = props;
          return (
            <EntityRow
              onRowClick={() => {
                console.log("clicked!");
              }}
              title={entity.attributes.fullName}
              label={entity.attributes.role}
            />
          );
        }}
      />
    );
  })

  .add("Header Margins", () => {
    const row = UserRow;
    const entities = [users[0]];
    const titleStyle = "bar";
    const unit = "user";
    const buttons = [
      <Button path="/foo" text="Add New Project" type="add" />,
      <Button path="/foo" text="Add New Project" type="add" />
    ];
    const search = (
      <Search
        filters={threeFilters}
        sortOptions={sortOptions}
        onChange={callbacks.onSearchChange}
      />
    );

    const wrap = child => {
      return (
        <div
          style={{
            padding: "40px 0",
            border: 0,
            borderBottom: "1px solid #424242",
            borderStyle: "dashed"
          }}
        >
          {child}
        </div>
      );
    };

    const baseProps = {
      pagination,
      callbacks,
      entities,
      titleStyle,
      unit,
      entityComponent: row
    };

    return (
      <>
        {wrap(
          <EntitiesList
            {...baseProps}
            instructions={"foo bar"}
            search={search}
            buttons={buttons}
            title={"All the things"}
            showCount
          />
        )}
      </>
    );
  });
