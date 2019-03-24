import React from "react";
import { build, storiesOf } from "helpers/storybook/exports";
import List from "../List";

const project = build.entity.project();
const categories = build.arrayOf.type("categories", 3);
const texts = [
  build.entity.text(null, {}, { category: null }),
  build.entity.text(null, {}, { category: categories[0] }),
  build.entity.text(null, {}, { category: categories[2] }),
  build.entity.text(null, {}, { category: categories[2] })
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
