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
        <Trans
          i18nKey="errors.content_block.no_contents"
          components={[<Link to={blockEditLink} />]}
        />
      )
    },
    "Content::RecentActivityBlock": {
      has_activity: <Trans i18nKey="errors.content_block.no_activity" />
    },
    "Content::MarkdownBlock": {
      body: (
        <Trans
          i18nKey="errors.content_block.no_markdown"
          components={[<Link to={blockEditLink} />]}
        />
      )
    },
    "Content::TextsBlock": {
      texts: (
        <Trans
          i18nKey="errors.content_block.no_texts"
          components={[
            <Link to={getProjectEditLink("backendProjectTexts")} />,
            <Link to={blockEditLink} />
          ]}
        />
      )
    },
    "Content::ResourcesBlock": {
      resources_or_collections: (
        <Trans
          i18nKey="errors.content_block.no_resources"
          components={[
            <Link to={getProjectEditLink("backendProjectResources")} />,
            <Link
              to={getProjectEditLink("backendProjectResourceCollections")}
            />
          ]}
        />
      )
    },
    "Content::MetadataBlock": {
      has_metadata: (
        <Trans
          i18nKey="errors.content_block.no_metadata"
          components={[
            <Link to={getProjectEditLink("backendProjectMetadata")} />
          ]}
        />
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
      <Trans
        i18nKey="errors.content_block.default"
        components={[<Link to={blockEditLink} />]}
      />
    </span>
  );
}
