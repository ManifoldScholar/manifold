import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function Issuer({ label, index, onRemove }) {
  return (
    <Styled.Item>
      <span>{label}</span>
      <Styled.ButtonGroup>
        <Styled.Button
          onClick={e => {
            e.preventDefault();
            onRemove(index);
          }}
        >
          <IconComposer icon="delete32" size={24} />
        </Styled.Button>
      </Styled.ButtonGroup>
    </Styled.Item>
  );
}

Issuer.displayName = "Settings.LTI.AllowBlockList.Issuer";

Issuer.propTypes = {
  label: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired
};
