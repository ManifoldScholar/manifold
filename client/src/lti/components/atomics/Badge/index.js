import { useTranslation } from "react-i18next";
import { ICON_MAP } from "lti/components/Cart/Group/index";
import IconComputed from "global/components/icon-computed";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "frontend/components/resource/Badge/styles";

export default function LtiBadge({ type, resourceKind }) {
  const { t } = useTranslation();

  return (
    <Styled.Wrapper style={{ "--Badge-color": "var(--color-base-neutral90)" }}>
      <span>
        <IconComposer icon={ICON_MAP[type]} size={20} />
        <span>{t(`lti.types_one.${type}`)}</span>
      </span>
      {type === "resource" && resourceKind && (
        <Styled.Kind>
          <IconComputed.Resource icon={resourceKind} size={20} />
          <span>{resourceKind}</span>
        </Styled.Kind>
      )}
    </Styled.Wrapper>
  );
}
