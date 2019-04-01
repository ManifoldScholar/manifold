import React from "react";
import { build, storiesOf } from "helpers/storybook/exports";
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

const users = build.arrayOf.users(8);
const makers = build.arrayOf.makers(8);
const projects = build.arrayOf.projects(6);
const features = build.arrayOf.type("features", 6);
const pages = build.arrayOf.type("pages", 6);
const events = build.arrayOf.type("events", 6);
const resourceCollections = build.arrayOf.resourceCollections(6);
const resources = build.arrayOf.resources(6);
const twitterQueries = build.arrayOf.type("twitterQueries", 6);
const subjects = build.arrayOf.type("subjects", 6);
const permissions = build.arrayOf.permissions(6);
const versions = build.arrayOf.type("versions", 6);

const pagination = {
  perPage: 20,
  currentPage: 3,
  nextPage: 2,
  prevPage: 0,
  totalPages: 10,
  totalCount: 32
};
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
  search: {
    onChange: fakeHandler,
    reset: fakeHandler
  }
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
            filter={{}}
            filters={threeFilters}
            sortOptions={sortOptions}
            {...callbacks.search}
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
            filter={{}}
            filters={threeFilters}
            sortOptions={sortOptions}
            {...callbacks.search}
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
          <Search filter={{}} filters={twoFilters} {...callbacks.search} />
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
        unit={{
          singular: "project",
          plural: "projects"
        }}
        search={
          <Search
            filter={{}}
            filters={threeFilters}
            sortOptions={sortOptions}
            {...callbacks.search}
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
            filter={{}}
            filters={threeFilters}
            sortOptions={sortOptions}
            {...callbacks.search}
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
    return (
      <EntitiesList
        title={"Features"}
        titleStyle="bar"
        entities={features}
        entityComponent={FeatureRow}
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
        filter={{}}
        filters={threeFilters}
        sortOptions={sortOptions}
        {...callbacks.search}
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
      <React.Fragment>
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
      </React.Fragment>
    );
  });
