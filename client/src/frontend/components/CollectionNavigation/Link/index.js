import PropTypes from "prop-types";
import { Link as ReactRouterLink } from "react-router-dom";
import Button from "global/components/atomic/Button";

function Link({ to, label, icon }) {
  return (
    <Button
      as={ReactRouterLink}
      to={to}
      label={label}
      preIcon={icon}
      postIcon="arrowLongRight16"
      size="md"
      background="neutral"
    />
  );
}

Link.displayName = "Frontend.Entity.CollectionNavigation.Link";

Link.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

export default Link;
