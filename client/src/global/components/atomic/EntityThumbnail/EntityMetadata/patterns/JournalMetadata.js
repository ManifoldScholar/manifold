import React from "react";
import { useTranslation } from "react-i18next";
import MetadataContent from "../Content";
import { getGenericMetadataProps } from "../helpers";

export default function JournalMetadata({ entity, ...props }) {
  const { t } = useTranslation();

  if (!entity) return;

  const getMetadataProps = () => {
    const genericMetadata = getGenericMetadataProps({ entity });

    const data = entity?.attributes;

    // This shows the number of volumes & issues, including drafts
    // const additionalData = `${t("counts.volume", { count: data.journalVolumesCount })}, ${t("counts.issue", { count: data.journalIssuesCount })}`;

    const draft = data.draft;
    const showUpdated = !draft && !!data.updatedAt;
    const date = showUpdated ? data.updatedAt : null;
    const prefix = showUpdated ? t("dates.updated_title_case") : null;

    return {
      date,
      prefix,
      // additionalData,
      ...genericMetadata
    };
  };

  const metaDataProps = getMetadataProps();

  return <MetadataContent {...metaDataProps} {...props} />;
}
