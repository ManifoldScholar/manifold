import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

function Header({ title, icon }) {
  return (
    <Styled.Header>
      {icon && <Styled.Icon size={60} icon={icon} />}
      <Styled.Title className="title">{title}</Styled.Title>
    </Styled.Header>
  );
}

Header.displayName = "Global.Composed.EntityCollection.Header";

Header.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string
};

export default Header;
