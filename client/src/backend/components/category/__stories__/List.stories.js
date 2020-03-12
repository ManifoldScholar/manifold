import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import List from "../List";

const project = fixtures.factory("project");
const categories = fixtures.collectionFactory("project");
const texts = [
  fixtures.factory("text", { relationships: { category: categories[0] } }),
  fixtures.factory("text", { relationships: { category: categories[1] } }),
  fixtures.factory("text", { relationships: { category: categories[2] } })
];

storiesOf("Backend/Category", module).add("List", () => {
  return (
    <List
      project={project}
      categories={categories}
      texts={texts}
      callbacks={{}}
    />
  );
});
