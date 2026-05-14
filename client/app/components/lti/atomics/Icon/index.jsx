import IconComposer from "components/global/utility/IconComposer";
import * as Styled from "./styles";

export default function LtiIcon({ icon, iconSize = 70, transform, bgSize }) {
  return (
    <Styled.Background $iconTransform={transform} $size={bgSize}>
      <IconComposer icon={icon} size={iconSize} />
    </Styled.Background>
  );
}
