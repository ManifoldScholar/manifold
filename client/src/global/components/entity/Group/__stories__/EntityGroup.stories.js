import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import EntityGroup from "..";

const ENTITY_COUNT = 4;

const Container = ({ children }) => <div className="bg-white">{children}</div>;
const projects = fixtures.collectionFactory("project", ENTITY_COUNT);

storiesOf("Global/EntityGroup", module)
  .add("Unlinked", () => (
    <Container>
      <EntityGroup title="Volume 2" entities={projects} />
    </Container>
  ))
  .add("Linked", () => (
    <Container>
      <EntityGroup title="Volume 3" to="/" entities={projects.slice(0, 3)} />
    </Container>
  ));
