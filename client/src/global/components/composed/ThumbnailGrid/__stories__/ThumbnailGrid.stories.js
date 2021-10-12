import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import ThumbnailGrid from "..";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
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
const entities = shuffle(projects.concat(journals).concat(issues));

storiesOf("Global/ThumbnailGrid", module)
  .add("Grid", () => {
    return (
      <div style={{ padding: "5% 10%" }} className="bg-white">
        <ThumbnailGrid>
          {({ stack }) =>
            entities.map(item => (
              <EntityThumbnail
                entity={item}
                userMock={user}
                onUncollect={() => console.log("clicked uncollect")}
                stack={stack}
              />
            ))
          }
        </ThumbnailGrid>
      </div>
    );
  })
  .add("List", () => {
    return (
      <div style={{ padding: "5% 10%", width: "400px" }} className="bg-white">
        <ThumbnailGrid>
          {({ stack }) =>
            entities.map(item => (
              <EntityThumbnail
                entity={item}
                userMock={user}
                onUncollect={() => console.log("clicked uncollect")}
                stack={stack}
              />
            ))
          }
        </ThumbnailGrid>
      </div>
    );
  })
  .add("Empty", () => {
    return (
      <div style={{ padding: "5% 10%" }} className="bg-white">
        <ThumbnailGrid />
      </div>
    );
  });
