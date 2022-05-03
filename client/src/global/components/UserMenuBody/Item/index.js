import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import * as Styled from "./styles";

function UserMenuBodyItem({ as = "a", to, title, icon, onClick }) {
  const Tag = as === "a" ? NavLink : "button";
  return (
    <Styled.Item>
      <Styled.Link as={Tag} to={to} onClick={onClick}>
        <Styled.Icon icon={icon} size={32} />
        <span>{title}</span>
      </Styled.Link>
    </Styled.Item>
  );
}

UserMenuBodyItem.displayName = "UserMenuBody.Item";

UserMenuBodyItem.propTypes = {
  as: PropTypes.oneOf(["a", "button"]),
  to: PropTypes.string,
  title: PropTypes.string.isRequired,
  srTitle: PropTypes.string,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default UserMenuBodyItem;
