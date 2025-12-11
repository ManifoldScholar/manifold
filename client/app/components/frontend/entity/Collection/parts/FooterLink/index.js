import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

function FooterLink({ to, label, ...restProps }) {
  return (
    <Styled.Link to={to} {...restProps}>
      <span>{label}</span>
      <Styled.Icon icon="arrowLongRight16" />
    </Styled.Link>
  );
}

FooterLink.displayName = "Frontend.Entity.Collection.FooterLink";

FooterLink.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default FooterLink;
