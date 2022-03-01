import React from "react";
import { useTranslation } from "react-i18next";
import Utility from "global/components/utility";

export default function ResourceListSlideFigureLoading() {
  const { t } = useTranslation();
  return (
    <figure>
      <div
        className="figure-default"
        style={{ backgroundImage: "url(/static/images/resource-splash.png)" }}
      >
        <div className="resource-info">
          <Utility.IconComposer
            size={120}
            icon="resourceFile64"
            className="resource-slide-figure__resource-icon"
          />
          <span className="resource-type">{t("loading")}</span>
          <span className="resource-date">{t("loading")}</span>
        </div>
      </div>
    </figure>
  );
}

ResourceListSlideFigureLoading.displayName = "ResourceList.Loading";
