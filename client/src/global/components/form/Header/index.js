import PropTypes from "prop-types";
import Instructions from "../Instructions";
import * as Styled from "./styles";

export default function FormHeader({ label, id, instructions, styleType }) {
  const Header = styleType === "primary" ? Styled.HeaderPrimary : Styled.Header;

  return (
    <Header $hasInstructions={instructions}>
      <h2 id={id}>{label}</h2>
      {instructions && (
        <Instructions
          instructions={instructions}
          styleType={styleType ?? "primary"}
        />
      )}
    </Header>
  );
}

FormHeader.displayName = "Form.Header";

FormHeader.propTypes = {
  label: PropTypes.node.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  instructions: PropTypes.string,
  styleType: PropTypes.oneOf(["primary", "secondary"])
};
