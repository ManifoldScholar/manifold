import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import ThumbnailGrid from "..";
import shuffle from "lodash/shuffle";

const issues = fixtures
  .collectionFactory("issue", 3)
  .map(issue => issue.data)
  .map(issue => {
    return {
      ...issue,
      attributes: { ...issue.attributes, avatarColor: "quinary" }
    };
  });
const projects = fixtures.collectionFactory("project", 3).map(issue => {
  return {
    ...issue,
    attributes: { ...issue.attributes, avatarColor: "tertiary" }
  };
});
const journals = fixtures.collectionFactory("journal", 3);
const user = fixtures.entities.user();

storiesOf("Global/ThumbnailGrid", module).add("Default", () => {
  return (
    <div style={{ padding: "5% 10%" }}>
      <ThumbnailGrid
        entities={shuffle(projects.concat(journals).concat(issues))}
        userMock={user}
        onUncollect={() => console.log("clicked uncollect")}
      />
    </div>
  );
});
