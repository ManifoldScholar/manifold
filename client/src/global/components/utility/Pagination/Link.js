import React from "react";
import PropTypes from "prop-types";
import { Link as ReactRouterLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import * as Styled from "./styles";

function Link({ page, paginationClickHandler, disabled, children, ...props }) {
  const { search } = useLocation();

  const handler =
    typeof paginationClickHandler === "function"
      ? paginationClickHandler(page)
      : null;

  if (typeof handler === "function") {
    return (
      <Styled.Link
        as="button"
        aria-disabled={disabled}
        onClick={!disabled ? handler : event => event.preventDefault()}
        {...props}
      >
        {children}
      </Styled.Link>
    );
  }

  const params = queryString.parse(search);
  const update = { ...params, page };

  const to =
    typeof handler === "string" ? handler : `?${queryString.stringify(update)}`;

  return (
    <Styled.Link
      as={ReactRouterLink}
      aria-disabled={disabled}
      to={to}
      {...props}
    >
      {children}
    </Styled.Link>
  );
}

Link.displayName = "Utility.Pagination.Link";

Link.propTypes = {
  page: PropTypes.number,
  paginationClickHandler: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node
};

export default Link;
