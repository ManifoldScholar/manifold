import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

function Link({ to, label, icon }) {
  return (
    <Styled.Link to={to}>
      <IconComposer icon={icon} size="32" />
      <Styled.Label>{label}</Styled.Label>
      <IconComposer icon="arrowLongRight16" size="default" />
    </Styled.Link>
  );
}

Link.displayName = "Frontend.Entity.CollectionNavigation.Link";

Link.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

export default Link;
