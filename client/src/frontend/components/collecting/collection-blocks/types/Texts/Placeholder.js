import React from "react";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import Skeleton from "frontend/components/collecting/ContentSkeleton";
import * as Styled from "frontend/components/text/styles";
import * as StyledCover from "global/components/text/Cover/styles";

function Placeholder() {
  const { t } = useTranslation();

  return (
    <Styled.Block $loading>
      <Styled.Content aria-hidden>
        <Styled.Inner>
          <StyledCover.Cover>
            <IconComposer size={78} icon="textsLoosePages64" />
          </StyledCover.Cover>
          <Styled.Bibliographic>
            <Styled.Name>
              <Skeleton />
            </Styled.Name>
          </Styled.Bibliographic>
        </Styled.Inner>
      </Styled.Content>
      <Styled.Meta>
        <Styled.InteractionList>
          <Styled.Interaction>
            <IconComposer size={32} icon="interactAnnotate32" />
            <Styled.InteractionLabel aria-hidden="true">
              0
            </Styled.InteractionLabel>
          </Styled.Interaction>
          <Styled.Interaction>
            <IconComposer size={32} icon="interactHighlight32" />
            <Styled.InteractionLabel aria-hidden="true">
              0
            </Styled.InteractionLabel>
          </Styled.Interaction>
        </Styled.InteractionList>
      </Styled.Meta>
      <span className="screen-reader-text">{t("common.loading")}</span>
    </Styled.Block>
  );
}

Placeholder.className = "Collecting.TextPlaceholder";

export default Placeholder;
