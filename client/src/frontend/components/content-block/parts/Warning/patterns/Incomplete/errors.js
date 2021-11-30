import React from "react";
import { Link } from "react-router-dom";
import has from "lodash/has";
import lh from "helpers/linkHandler";

export function generateError(key, block) {
  const type = block.attributes.type;
  const projectId = block.relationships.project.id;

  function getProjectEditLink(linkType) {
    return lh.link(linkType, projectId, block.id);
  }

  const blockEditLink = lh.link(
    "backendProjectContentBlock",
    projectId,
    block.id
  );

  const availableErrors = {
    "Content::TableOfContentsBlock": {
      text: (
        <>
          Specify a text to <Link to={blockEditLink}>fix this block</Link>.
        </>
      )
    },
    "Content::RecentActivityBlock": {
      has_activity: (
        <>
          No activity has been recorded for this project. This warning will
          disappear once there is project activity.
        </>
      )
    },
    "Content::MarkdownBlock": {
      body: (
        <>
          Add Markdown content to <Link to={blockEditLink}>fix this block</Link>
          .
        </>
      )
    },
    "Content::TextsBlock": {
      texts: (
        <>
          <Link to={getProjectEditLink("backendProjectTexts")}>
            Add texts to the project
          </Link>{" "}
          or <Link to={blockEditLink}>adjust the block configuration</Link> to
          fix this block.
        </>
      )
    },
    "Content::ResourcesBlock": {
      resources_or_collections: (
        <>
          Add{" "}
          <Link to={getProjectEditLink("backendProjectResources")}>
            resources
          </Link>{" "}
          or{" "}
          <Link to={getProjectEditLink("backendProjectResourceCollections")}>
            resource collections
          </Link>{" "}
          to the project to fix this block.
        </>
      )
    },
    "Content::MetadataBlock": {
      has_metadata: (
        <>
          <Link to={getProjectEditLink("backendProjectMetadata")}>
            Add project metadata
          </Link>{" "}
          to fix this block.
        </>
      )
    }
  };

  if (!has(availableErrors, [type, key])) return null;
  return availableErrors[type][key];
}

export function getDefaultError(block) {
  const blockEditLink = lh.link(
    "backendProjectContentBlock",
    block.relationships.project.id,
    block.id
  );
  return (
    <span key="default-error">
      <Link to={blockEditLink}>Fix this content block.</Link>
    </span>
  );
}
