import Icon from "lti/components/atomics/Icon";
import * as Styled from "./styles";

export default function BrowseButton({ to, icon, label, description }) {
  return (
    <Styled.Button to={to}>
      <Styled.Label>{label}</Styled.Label>
      <Icon icon={icon} />
      <p>{description}</p>
    </Styled.Button>
  );
}
