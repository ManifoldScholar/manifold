import { useTranslation } from "react-i18next";
import { ICON_MAP } from "app/components/lti/Cart/Group/index";
import IconComputed from "components/global/icon-computed";
import IconComposer from "components/global/utility/IconComposer";
import * as Styled from "app/components/frontend/resource/Badge/styles";

export default function LtiBadge({ type, resourceKind }) {
  const { t } = useTranslation();

  return (
    <Styled.Wrapper style={{ "--Badge-color": "var(--color-base-neutral90)" }}>
      <span>
        <IconComposer icon={ICON_MAP[type]} size={20} />
        <span>{t(`lti.types.${type}`)}</span>
      </span>
      {resourceKind && (
        <Styled.Kind>
          <IconComputed.Resource icon={resourceKind} size={20} />
          <span>{resourceKind}</span>
        </Styled.Kind>
      )}
    </Styled.Wrapper>
  );
}
