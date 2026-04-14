import React from "react";
import { useTranslation } from "react-i18next";
import IconComposer from "components/global/utility/IconComposer";
import Skeleton from "components/frontend/collecting/ContentSkeleton";
import * as Styled from "components/frontend/text/styles";
import * as StyledCover from "components/global/text/Cover/styles";

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
