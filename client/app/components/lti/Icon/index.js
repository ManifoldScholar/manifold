import IconComposer from "components/global/utility/IconComposer";
import * as Styled from "./styles";

export default function LtiIcon({ icon, size = 70, transform }) {
  return (
    <Styled.Background $iconTransform={transform}>
      <IconComposer icon={icon} size={size} />
    </Styled.Background>
  );
}
