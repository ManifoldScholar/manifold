import React from "react";
import IconComposer from "global/components/utility/IconComposer";
import Skeleton from "frontend/components/collecting/ContentSkeleton";
import { useTranslation } from "react-i18next";
import * as Styled from "frontend/components/resource-collection/Cover/styles";

function Placeholder() {
  const { t } = useTranslation();
  return (
    <>
      <Styled.Cover as="div" $isPlaceholder aria-hidden>
        <Styled.TitleOverlay>
          <Styled.Title>
            <Skeleton nested style={{ height: 20, maxWidth: 200 }} />
          </Styled.Title>
          <Styled.IconWrapper>
            <IconComposer size={48} icon="resourceCollection64" />
            <Styled.IconText>
              {t("glossary.collection_title_case_one")}
            </Styled.IconText>
          </Styled.IconWrapper>
        </Styled.TitleOverlay>
      </Styled.Cover>
      <span className="screen-reader-text">{t("common.loading")}</span>
    </>
  );
}

Placeholder.className = "Collecting.ResourceCollectionPlaceholder";

export default Placeholder;
