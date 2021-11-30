import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

function FooterLink({ to, label }) {
  return (
    <Styled.Link to={to}>
      <span>{label}</span>
      <Styled.Icon icon="arrowLongRight16" />
    </Styled.Link>
  );
}

FooterLink.displayName = "Frontend.Composed.EntityCollection.FooterLink";

FooterLink.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default FooterLink;
