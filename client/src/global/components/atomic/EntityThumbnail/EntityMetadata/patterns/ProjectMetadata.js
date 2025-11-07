import React from "react";
import { useTranslation } from "react-i18next";
import MetadataContent from "../Content";
import { getGenericMetadataProps } from "../helpers";

export default function ProjectMetadata({ entity, ...props }) {
  const { t } = useTranslation();

  if (!entity) return;

  const getMetadataProps = () => {
    const genericMetadata = getGenericMetadataProps({ entity });

    const data = entity?.attributes;

    const namesArray = data?.creatorNames
      ? data.creatorNames.split(", ")
      : null;

    let additionalData = null;

    if (namesArray) {
      if (namesArray.length > 3) {
        const firstThree = namesArray.slice(0, 3).join(", ");
        additionalData = t("common.et_al", { names: firstThree });
      } else {
        additionalData = data.creatorNames;
      }
    }

    const draft = data.draft;
    const showUpdated = !data.finished && !!data.updated;

    /* eslint-disable no-nested-ternary */
    const date = draft
      ? null
      : showUpdated
      ? data.updatedAt
      : data.publicationDate;

    /* eslint-disable no-nested-ternary */
    const prefix = showUpdated
      ? t("dates.updated_title_case")
      : t("dates.published_title_case");

    return {
      date,
      prefix,
      additionalData,
      ...genericMetadata
    };
  };

  const metaDataProps = getMetadataProps();

  return <MetadataContent {...metaDataProps} {...props} />;
}
