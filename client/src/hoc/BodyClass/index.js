import PropTypes from "prop-types";
import useBodyClass from "hooks/useBodyClass";

// Component wrapper for backward compatibility
// Prefer using the useBodyClass hook directly in new code
export default function BodyClass({ className, children }) {
  useBodyClass(className);
  return children ?? null;
}

BodyClass.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.node
};
