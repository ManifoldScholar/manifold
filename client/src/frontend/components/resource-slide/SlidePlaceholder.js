import React from "react";
import { useTranslation } from "react-i18next";
import Utility from "global/components/utility";

export default function ResourceListSlidePlaceholder() {
  const { t } = useTranslation();
  return (
    <>
      <div
        className="figure-default"
        style={{
          backgroundImage: "url(/static/images/resource-collection.jpg)"
        }}
      >
        <div className="resource-info">
          <Utility.IconComposer
            size={120}
            icon="resourceCollection64"
            className="resource-slide-figure__resource-icon"
          />
          <span className="resource-type">
            {t("placeholders.resource_collection")}
          </span>
        </div>
      </div>
    </>
  );
}

ResourceListSlidePlaceholder.displayName = "ResourceList.Slide.Placeholder";
