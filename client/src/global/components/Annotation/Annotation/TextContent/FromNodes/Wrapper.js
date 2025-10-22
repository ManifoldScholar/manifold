import React from "react";
import Collapse from "global/components/Collapse";
import * as Styled from "./styles";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";

export default function FromNodesWrapper({ children, overlayLight }) {
  const { t } = useTranslation();
  return (
    <Collapse stubHeight={200}>
      <Styled.Content focusOnVisible>
        <blockquote>{children}</blockquote>
        <Styled.Overlay $light={overlayLight} />
      </Styled.Content>
      <Styled.Toggle>
        <span className="toggle-show-label">{t("actions.show")}</span>
        <span className="toggle-hide-label">{t("actions.hide")}</span>
        <IconComposer icon="disclosureDown16" size={16} />
      </Styled.Toggle>
    </Collapse>
  );
}
