import React from "react";
import { Link } from "react-router-dom";
import { Trans } from "react-i18next";
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
        <Trans i18nKey="errors.content_block.no_contents">
          Specify a text to <Link to={blockEditLink}>fix this block</Link>.
        </Trans>
      )
    },
    "Content::RecentActivityBlock": {
      has_activity: (
        <Trans i18nKey="errors.content_block.no_activity">
          No activity has been recorded for this project. This warning will
          disappear once there is project activity.
        </Trans>
      )
    },
    "Content::MarkdownBlock": {
      body: (
        <Trans i18nKey="errors.content_block.no_markdown">
          Add Markdown content to <Link to={blockEditLink}>fix this block</Link>
          .
        </Trans>
      )
    },
    "Content::TextsBlock": {
      texts: (
        <Trans i18nKey="errors.content_block.no_texts">
          <Link to={getProjectEditLink("backendProjectTexts")}>
            Add texts to the project
          </Link>{" "}
          or <Link to={blockEditLink}>adjust the block configuration</Link> to
          fix this block.
        </Trans>
      )
    },
    "Content::ResourcesBlock": {
      resources_or_collections: (
        <Trans i18nKey="errors.content_block.no_resources">
          Add{" "}
          <Link to={getProjectEditLink("backendProjectResources")}>
            resources
          </Link>{" "}
          or{" "}
          <Link to={getProjectEditLink("backendProjectResourceCollections")}>
            resource collections
          </Link>{" "}
          to the project to fix this block.
        </Trans>
      )
    },
    "Content::MetadataBlock": {
      has_metadata: (
        <Trans i18nKey="errors.content_block.no_metadata">
          <Link to={getProjectEditLink("backendProjectMetadata")}>
            Add project metadata
          </Link>{" "}
          to fix this block.
        </Trans>
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
      <Trans i18nKey="errors.content_block.default">
        <Link to={blockEditLink}>Fix this content block.</Link>
      </Trans>
    </span>
  );
}
