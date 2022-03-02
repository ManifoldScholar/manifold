import React from "react";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import Skeleton from "frontend/components/collecting/ContentSkeleton";
import * as StyledThumbnail from "frontend/components/resourceish/Thumbnail/styles";
import * as StyledIcon from "frontend/components/resourceish/Thumbnail/Icon/styles";
import * as Styled from "./styles";

function Placeholder() {
  const { t } = useTranslation();
  return (
    <>
      <Styled.Wrapper $showTitle aria-hidden>
        <Styled.Inner>
          <StyledThumbnail.Figure>
            <figcaption>
              <Skeleton nested style={{ maxWidth: 64, minHeight: 14 }} />
            </figcaption>
            <StyledIcon.Wrapper>
              <StyledIcon.Icon as={IconComposer} icon="resources64" size={56} />
            </StyledIcon.Wrapper>
          </StyledThumbnail.Figure>
          <StyledThumbnail.Title>
            <Skeleton nested style={{ width: "70%", marginLeft: "15%" }} />
          </StyledThumbnail.Title>
        </Styled.Inner>
      </Styled.Wrapper>
      <span className="screen-reader-text">{t("common.loading")}</span>
    </>
  );
}

Placeholder.className = "Collecting.ResourcePlaceholder";

export default Placeholder;
