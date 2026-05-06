import Icon from "components/lti/Icon";
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
