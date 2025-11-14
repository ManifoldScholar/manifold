import React from "react";
// import { useTranslation } from "react-i18next";
import MetadataContent from "../Content";
import { getGenericMetadataProps } from "../helpers";

export default function ProjectCollectionMetadata({ entity, ...props }) {
  // const { t } = useTranslation();

  if (!entity) return;

  const getMetadataProps = () => {
    const genericMetadata = getGenericMetadataProps({ entity });

    // const data = entity?.attributes;
    // The project count does not reflect if the user is logged in - hidden projects are included in the count
    // const additionalData = t("counts.project", { count: data.projectsCount });

    return {
      // additionalData,
      ...genericMetadata
    };
  };

  const metaDataProps = getMetadataProps();

  return <MetadataContent {...metaDataProps} {...props} />;
}
