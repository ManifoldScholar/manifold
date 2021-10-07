import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import ThumbnailGrid from "frontend/components/ThumbnailGrid";

const issue = fixtures.entities.issue();
const project = fixtures.entities.project();
const journal = fixtures.entities.journal();
console.log(project);
const list = Array(6)
  .fill(issue.data, 0, 2)
  .fill(project, 2, 4)
  .fill(journal, 4, 6);
const user = fixtures.entities.user();

console.log(list);

storiesOf("Frontend/ThumbnailGrid", module).add("Default", () => {
  return (
    <div style={{ padding: "5% 10%" }}>
      <ThumbnailGrid
        entities={list}
        userMock={user}
        onUncollect={() => console.log("clicked uncollect")}
      />
    </div>
  );
});
