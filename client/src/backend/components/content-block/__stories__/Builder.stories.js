import React from "react";
import { build, storiesOf } from "helpers/storybook/exports";
import Builder from "../Builder";
import { setCurrentUser } from "actions/currentUser";

const project = build.entity.project();
const admin = build.entity.user();

const contentBlocks = [
  "Content::MarkdownBlock",
  "Content::MetadataBlock",
  "Content::RecentActivityBlock",
  "Content::ResourcesBlock",
  "Content::TableOfContentsBlock",
  "Content::TextsBlock"
].map((t, i) =>
  build.entity.contentBlock(
    null,
    {
      position: i,
      type: t,
      abilities: {
        update: true,
        delete: true
      }
    },
    { project }
  )
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
