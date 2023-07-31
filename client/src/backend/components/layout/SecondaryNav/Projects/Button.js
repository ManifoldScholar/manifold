import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Utility from "global/components/utility";
import * as Styled from "./styles";

function ProjectsButton(
  { className, link, index, toggleVisible, journalIsActive, ...props },
  ref
) {
  const { t } = useTranslation();

  const { pathname } = useLocation();
  const active = pathname?.includes("/projects");

  return (
    <li className="site-nav__item">
      <Styled.Button ref={ref} tabIndex={0} onClick={toggleVisible} {...props}>
        <Styled.ButtonText
          className="site-nav__link"
          $active={
            active && typeof journalIsActive === "boolean" && !journalIsActive
          }
        >
          <span>{t(link.label)}</span>
          <Utility.IconComposer icon="disclosureDown24" size={16} />
        </Styled.ButtonText>
      </Styled.Button>
    </li>
  );
}

ProjectsButton.displayName = "UserMenuButton";

export default forwardRef(ProjectsButton);
