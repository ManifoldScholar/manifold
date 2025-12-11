import React from "react";
import { useTranslation } from "react-i18next";
import MetadataContent from "../Content";

export default function JournalIssueMetadata({ entity, parentView, ...props }) {
  const { t } = useTranslation();

  if (!entity) return;

  const getMetadataProps = () => {
    let title;
    let additionalData;
    let bumpDraftDown;

    // Catch issues rendered as part of the Featured Projects collection
    if (entity.attributes.isJournalIssue) {
      title =
        entity.relationships.journalIssue?.relationships?.journal?.attributes
          ?.title;
      additionalData = entity.attributes.journalVolumeNumber
        ? t("journals.volume_issue_number", {
            volNum: entity.attributes.journalVolumeNumber,
            issNum: entity.attributes.number
          })
        : t("journals.issue_number", { issNum: entity.attributes.number });
      bumpDraftDown = true;
    }
    // Catch thumbnails rendered in context on a Journal or Volume Detail
    else if (parentView) {
      title = t("journals.issue_number", {
        issNum: entity.attributes.number
      });
    }
    // Issues rendered on the Homepage or Journals/Issues List
    else {
      title = entity.relationships.journal?.attributes?.title;
      additionalData = entity.attributes.journalVolumeNumber
        ? t("journals.volume_issue_number", {
            volNum: entity.attributes.journalVolumeNumber,
            issNum: entity.attributes.number
          })
        : t("journals.issue_number", { issNum: entity.attributes.number });
      bumpDraftDown = true;
    }

    const data = entity.attributes.isJournalIssue
      ? entity.relationships.journalIssue?.attributes
      : entity?.attributes;
    const date = data.publicationDate ?? data.updatedAt;
    const prefix = data.publicationDate
      ? t("dates.published_title_case")
      : t("dates.updated_title_case");
    const draft = data.draft;
    const recentlyUpdated = data.recentlyUpdated;

    return {
      date,
      prefix,
      title,
      additionalData,
      draft,
      bumpDraftDown,
      recentlyUpdated
    };
  };

  const metaDataProps = getMetadataProps();

  return <MetadataContent {...metaDataProps} {...props} />;
}
