import * as Styled from "./styles";

export default function Box({ children, className, ...props }) {
  return (
    <Styled.Container className={className} {...props}>
      <Styled.Background>{children}</Styled.Background>
    </Styled.Container>
  );
}

Box.displayName = "Global.Atomic.Box";
