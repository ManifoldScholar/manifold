import React from "react";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

export default function ResourceListSlideFigureLoading() {
  const { t } = useTranslation();
  return (
    <figure>
      <div
        className="figure-default"
        style={{ backgroundImage: "url(/static/images/resource-splash.png)" }}
      >
        <Styled.Info>
          <Styled.Icon size={120} icon="resourceFile64" />
          <Styled.Kind>{t("common.loading")}</Styled.Kind>
          <Styled.Date className="resource-date">
            {t("common.loading")}
          </Styled.Date>
        </Styled.Info>
      </div>
    </figure>
  );
}

ResourceListSlideFigureLoading.displayName = "ResourceList.Loading";
