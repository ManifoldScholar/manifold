import React from "react";
import MetadataContent from "./Content";

export default function Wrapper({
  entity,
  hideDescription,
  hideDate,
  ...props
}) {
  if (!entity) return;

  const getMetadataProps = () => {
    const data = entity?.attributes;
    if (entity.type === "journalIssues") {
      const title =
        entity.relationships.journal?.attributes?.title ?? "Journal Title";
      const additionalData = data.journalVolumeNumber
        ? `Volume ${data.journalVolumeNumber}, Issue ${data.number}`
        : `Issue ${data.number}`;
      const date = data.publicationDate ?? data.updatedAt;
      const prefix = data.publicationDate ? "Published" : "Updated";
      const draft = data.draft;
      const recentlyUpdated = data.recentlyUpdated;
      return {
        date,
        prefix,
        title,
        additionalData,
        draft,
        recentlyUpdated
      };
    }
    const title = data.titleFormatted ?? data.title;
    const subtitle = data.subtitle;
    const description = !hideDescription && data.description;

    /* eslint-disable no-nested-ternary */
    const additionalData =
      "creatorNames" in data
        ? data.creatorNames
        : entity.relationships?.creators?.length > 0
        ? entity.relationships.creators
            .map(maker => maker.attributes.fullName)
            .join(", ")
        : null;
    /* eslint-enable no-nested-ternary */

    const draft = data.draft;
    const showUpdated = !data.finished && !!data.updated;
    /* eslint-disable no-nested-ternary */
    const date =
      hideDate || draft
        ? null
        : showUpdated
        ? data.updatedAt
        : data.publicationDate;
    /* eslint-disable no-nested-ternary */
    const prefix = showUpdated ? "Updated" : "Published";
    const recentlyUpdated = data.recentlyUpdated;

    return {
      date,
      prefix,
      additionalData,
      title,
      subtitle,
      draft,
      description,
      recentlyUpdated
    };
  };

  const metaDataProps = getMetadataProps();

  return <MetadataContent {...metaDataProps} {...props} />;
}
