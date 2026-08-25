import PropTypes from "prop-types";
import Issuer from "./Issuer";

export default function AllowBlockList({ value, handleRemove }) {
  if (!value?.length) return null;

  return (
    <ul>
      {/* eslint-disable react/no-array-index-key */}
      {value.map((issuer, i) => (
        <Issuer
          key={`issuer_${i}`}
          label={issuer}
          index={i}
          onRemove={handleRemove}
        />
      ))}
    </ul>
  );
}

AllowBlockList.displayName = "Settings.LTI.AllowBlockList";

AllowBlockList.propTypes = {
  value: PropTypes.array.isRequired,
  handleRemove: PropTypes.func.isRequired
};
