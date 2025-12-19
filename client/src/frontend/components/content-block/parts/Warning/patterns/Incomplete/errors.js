import React from "react";
import { Link } from "react-router-dom";
import { Trans } from "react-i18next";
import has from "lodash/has";

export function generateError(key, block) {
  const type = block.attributes.type;
  const projectId = block.relationships.project.id;

  const blockEditLink = `/backend/projects/${projectId}/layout/content-blocks/${block.id}`;

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
            <Link to={`/backend/projects/${projectId}/texts`} />,
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
            <Link to={`/backend/projects/${projectId}/resources`} />,
            <Link to={`/backend/projects/${projectId}/resource-collections`} />
          ]}
        />
      )
    },
    "Content::MetadataBlock": {
      has_metadata: (
        <Trans
          i18nKey="errors.content_block.no_metadata"
          components={[<Link to={`/backend/projects/${projectId}/metadata`} />]}
        />
      )
    }
  };

  if (!has(availableErrors, [type, key])) return null;
  return availableErrors[type][key];
}

export function getDefaultError(block) {
  const projectId = block.relationships.project.id;
  const blockEditLink = `/backend/projects/${projectId}/layout/content-blocks/${block.id}`;
  return (
    <span key="default-error">
      <Trans
        i18nKey="errors.content_block.default"
        components={[<Link to={blockEditLink} />]}
      />
    </span>
  );
}
