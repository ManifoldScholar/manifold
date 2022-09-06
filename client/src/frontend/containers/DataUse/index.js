import React from "react";
import { useTranslation } from "react-i18next";
import { useFromStore } from "hooks";
import * as Styled from "./styles";

export default function DataUseContainer() {
  const { t } = useTranslation();

  const settings = useFromStore("settings", "select");
  const usesAnalytics = !settings?.attributes?.general
    ?.disableInternalAnalytics;

  return (
    <div className="container">
      <Styled.Columns>
        <div>
          <h1 className="form-heading">
            {t("pages.frontend.data_use.header")}
          </h1>
          <Styled.Text>
            Nulla quis lorem ut libero malesuada feugiat. Donec rutrum congue
            leo eget malesuada.
          </Styled.Text>
          {usesAnalytics && (
            <>
              <Styled.CategoryHeader>
                {t("pages.frontend.data_use.internal_analytics")}
              </Styled.CategoryHeader>
              <Styled.Text>
                Nulla quis lorem ut libero malesuada feugiat. Donec rutrum
                congue leo eget malesuada. Nulla porttitor accumsan tincidunt.
                Vivamus magna justo, lacinia eget consectetur sed, convallis at
                tellus.
              </Styled.Text>
            </>
          )}
          <Styled.CategoryHeader>
            {t("pages.frontend.data_use.annotations")}
          </Styled.CategoryHeader>
          <Styled.Text>
            Nulla quis lorem ut libero malesuada feugiat. Donec rutrum congue
            leo eget malesuada. Nulla porttitor accumsan tincidunt. Vivamus
            magna justo, lacinia eget consectetur sed, convallis at tellus.
          </Styled.Text>
          <Styled.CategoryHeader>
            {t("pages.frontend.data_use.reading_groups")}
          </Styled.CategoryHeader>
          <Styled.Text>
            Nulla quis lorem ut libero malesuada feugiat. Donec rutrum congue
            leo eget malesuada. Nulla porttitor accumsan tincidunt. Vivamus
            magna justo, lacinia eget consectetur sed, convallis at tellus.
          </Styled.Text>
        </div>
        <Styled.ImagePlaceholder />
      </Styled.Columns>
    </div>
  );
}
