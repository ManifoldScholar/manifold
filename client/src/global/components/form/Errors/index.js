import PropTypes from "prop-types";
import Errorable from "../Errorable";

export default function Errors({ children, names, wide, ...otherProps }) {
  return (
    <Errorable
      className={wide ? "wide" : undefined}
      name={names}
      {...otherProps}
    >
      {children}
    </Errorable>
  );
}

Errors.displayName = "Form.Errors";

Errors.propTypes = {
  names: PropTypes.array.isRequired,
  wide: PropTypes.bool,
  children: PropTypes.node
};
