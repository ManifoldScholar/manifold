import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import { boolean, number } from "@storybook/addon-knobs";
import ProjectCollection from "../index";

const { Summary } = ProjectCollection;

const projects = fixtures.collectionFactory("project");
const collectionProjects = fixtures.collectionFactory("collectionProject");
const projectCollection = fixtures.factory("projectCollection", {
  relationships: { collectionProjects, subjects: [], projects }
});

storiesOf("Frontend/ProjectCollection", module).add("default", () => {
  const authenticated = boolean("Authenticated", true);
  const limit = number("Project limit", 5);
  const ordinal = number("Ordinal", 0);
  const invertColor = boolean("Invert Color", false);
  return (
    <Summary
      projectCollection={projectCollection}
      invertColor={invertColor}
      ordinal={ordinal}
      limit={limit}
      authentication={{ authenticated }}
    />
  );
});
