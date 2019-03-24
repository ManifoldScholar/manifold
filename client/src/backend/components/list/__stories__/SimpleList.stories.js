import React from "react";
import { build, storiesOf } from "helpers/storybook/exports";
import SimpleList from "backend/components/list/SimpleList";
import UserListItem from "backend/components/user/ListItem";
import ProjectListItem from "backend/components/project/ListItem";
import PermissionListItem from "backend/components/permission/ListItem";
import LogListItem from "backend/components/log/ListItem";
import ProjectCollection from "backend/components/project-collection";
import TwitterQuery from "backend/components/twitter-query";

const users = build.arrayOf.users(8);
const projects = build.arrayOf.projects(6);
const permissions = build.arrayOf.type("permissions");
const versions = build.arrayOf.type("versions");
const twitterQueries = build.arrayOf.type("twitterQueries");

const jsxOpts = {
  filterProps: ["entities"]
};

storiesOf("Backend/List/SimpleList", module)
  .addWithJSX("Users", () => {
    return (
      <div className="vertical-list-primary">
        <SimpleList entities={users} entityComponent={UserListItem} />
      </div>
    );
  })

  .addWithJSX("Dashboard", () => {
    return (
      <div className="vertical-list-primary">
        <SimpleList
          entities={projects}
          entityComponent={ProjectListItem}
          entityComponentProps={{ placeholderMode: "small" }}
          title={"Recently Updated"}
          icon={"manicon-bugle-small"}
          listClasses={"simple-list--flush"}
        />
      </div>
    );
  })

  .addWithJSX("Permissions", () => {
    return (
      <div className="vertical-list-primary">
        <SimpleList
          entities={permissions}
          entityComponent={PermissionListItem}
          entityComponentProps={{
            linkName: "backendProjectPermissions"
          }}
        />
      </div>
    );
  })

  .addWithJSX("Log Entries", () => {
    return (
      <nav className="flush results-list">
        <SimpleList
          entities={versions}
          entityComponent={LogListItem}
          title="Project Changes"
          icon="manicon-pulse-small"
        />
      </nav>
    );
  })

  .addWithJSX("Project Covers", () => {
    return (
      <section className="project-list grid">
        <SimpleList
          entities={projects}
          entityComponent={props => (
            <li>
              <ProjectCollection.ProjectCover
                projectCollection={build.entity.projectCollection()}
                entity={props.entity}
              />
            </li>
          )}
          name="collection-projects"
        />
      </section>
    );
  })

  .addWithJSX(
    "Twitter Queries",
    () => {
      return (
        <div className="vertical-list-primary">
          <SimpleList
            entities={twitterQueries}
            entityComponent={TwitterQuery.ListItem}
            entityComponentProps={{ active: true }}
          />
        </div>
      );
    },
    jsxOpts
  );
