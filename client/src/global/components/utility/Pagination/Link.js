import React from "react";
import PropTypes from "prop-types";
import { Link as ReactRouterLink } from "react-router-dom";
import * as Styled from "./styles";

function Link({
  page,
  paginationClickHandler,
  paginationTarget,
  disabled,
  children,
  ...props
}) {
  const handler = paginationClickHandler(page);
  let Component;
  let linkProps;

  if (typeof handler === "string") {
    Component = ReactRouterLink;
    linkProps = { to: handler };
  } else if (paginationTarget === "#") {
    Component = "button";
    linkProps = {
      onClick: !disabled ? handler : event => event.preventDefault()
    };
  } else {
    Component = "a";
    linkProps = {
      onClick: !disabled ? handler : event => event.preventDefault(),
      href: `?page=${page}`
    };
  }

  return (
    <Styled.Link
      as={Component}
      aria-disabled={disabled}
      {...linkProps}
      {...props}
    >
      {children}
    </Styled.Link>
  );
}

Link.displayName = "Utility.Pagination.Link";

Link.propTypes = {
  page: PropTypes.number,
  paginationClickHandler: PropTypes.func.isRequired,
  paginationTarget: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.node
};

export default Link;
