import Collapse from "global/components/Collapse";
import * as Styled from "./styles";
import { Trans, useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";

export default function FromNodesWrapper({ children, overlayLight }) {
  const { t } = useTranslation();

  return (
    <Collapse stubHeight={200} label={t("reader.annotated_passage")}>
      <Styled.Content focusOnVisible>
        <blockquote>{children}</blockquote>
        <Styled.Overlay $light={overlayLight} />
      </Styled.Content>
      <Styled.Toggle>
        <span className="toggle-show-label">
          <Trans
            i18nKey={"actions.expand_passage"}
            components={[<span className="screen-reader-text" />]}
          />
        </span>
        <span className="toggle-hide-label">
          <Trans
            i18nKey={"actions.collapse_passage"}
            components={[<span className="screen-reader-text" />]}
          />
        </span>
        <IconComposer icon="disclosureDown16" size={16} />
      </Styled.Toggle>
    </Collapse>
  );
}
