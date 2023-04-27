import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import * as Styled from "./styles";

function ProjectsButton(
  { className, link, index, toggleVisible, ...props },
  ref
) {
  const { t } = useTranslation();

  const { pathname } = useLocation();
  const active = pathname?.includes("/projects");

  return (
    <li className="site-nav__item">
      <Styled.Button ref={ref} tabIndex={0} onClick={toggleVisible} {...props}>
        <Styled.ButtonText className="site-nav__link" $active={active}>
          {t(link.label)}
        </Styled.ButtonText>
      </Styled.Button>
    </li>
  );
}

ProjectsButton.displayName = "UserMenuButton";

ProjectsButton.propTypes = {
  callbacks: PropTypes.shape({
    toggleUserPanel: PropTypes.func.isRequired,
    toggleSignInUpOverlay: PropTypes.func.isRequired
  }),
  visible: PropTypes.bool,
  context: PropTypes.oneOf(["frontend", "backend", "reader"])
};

export default forwardRef(ProjectsButton);
