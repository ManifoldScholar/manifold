import React from "react";
import { useTranslation } from "react-i18next";
import MetadataContent from "../Content";
import { getGenericMetadataProps } from "../helpers";

export default function ProjectCollectionMetadata({ entity, ...props }) {
  const { t } = useTranslation();

  if (!entity) return;

  const getMetadataProps = () => {
    const genericMetadata = getGenericMetadataProps({ entity });

    const data = entity?.attributes;
    const additionalData = t("counts.project", {
      count: data.availableProjectsCount
    });

    return {
      additionalData,
      ...genericMetadata
    };
  };

  const metaDataProps = getMetadataProps();

  return <MetadataContent {...metaDataProps} {...props} />;
}
