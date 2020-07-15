import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import ProjectCollection from "../index";

const { Summary } = ProjectCollection;

const projects = fixtures.collectionFactory("project");
const collectionProjects = fixtures.collectionFactory("collectionProject");
const projectCollection = fixtures.factory("projectCollection", {
  relationships: { collectionProjects, subjects: [], projects }
});

storiesOf("Frontend/ProjectCollection", module).add("default", () => {
  return (
    <Summary
      projectCollection={projectCollection}
      authentication={{ authenticated: true }}
    />
  );
});
