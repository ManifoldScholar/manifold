import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import Builder from "../Builder";
import { setCurrentUser } from "actions/currentUser";

const project = fixtures.factory("project");
const admin = fixtures.factory("user");
const contentBlocks = [
  "Content::MarkdownBlock",
  "Content::MetadataBlock",
  "Content::RecentActivityBlock",
  "Content::ResourcesBlock",
  "Content::TableOfContentsBlock",
  "Content::TextsBlock"
].map((t, i) =>
  fixtures.factory("contentBlock", {
    id: i,
    attributes: {
      attributes: {
        position: i,
        type: t,
        abilities: {
          update: true,
          delete: true
        }
      }
    }
  })
);
const history = { push: () => {} };
const fakeDispatch = reqIgnored => {
  return Promise.reject;
};

storiesOf("Backend/ContentBlock", module).add("Builder", options => {
  options.dispatch(setCurrentUser({ data: admin }));

  return (
    <Builder
      project={project}
      contentBlocks={contentBlocks}
      contentBlocksResponse={{}}
      confirm={() => {}}
      refresh={() => {}}
      history={history}
      dispatch={fakeDispatch}
    >
      {() => {}}
    </Builder>
  );
});
