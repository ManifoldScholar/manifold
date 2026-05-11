import IconComposer from "components/global/utility/IconComposer";
import * as Styled from "./styles";

export default function LtiMessage({ dismissable, noBorder, title, children }) {
  return (
    <Styled.Box $dismissable={dismissable} $noBorder={noBorder}>
      {dismissable && (
        <Styled.Close>
          <IconComposer icon="close16" size={20} />
        </Styled.Close>
      )}
      {title && <Styled.Title>{title}</Styled.Title>}
      <Styled.Body>{children}</Styled.Body>
    </Styled.Box>
  );
}
