import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

function ProjectsSecondaryNav(props, ref) {
  const { links, visible, ...dropDownProps } = props;
  const { t } = useTranslation();

  const pathForLink = link => {
    const args = link.args || [];
    return lh.link(link.route, ...args);
  };

  const renderItem = link => {
    const icon =
      link.route === "backendProjectsAll"
        ? "BEProject64"
        : "ProjectCollection32";

    return (
      <li key={link.label}>
        <Styled.Link
          to={pathForLink(link)}
          activeClassName="active"
          onClick={dropDownProps.toggleVisible}
        >
          <Styled.LinkIcon icon={icon} size={24} />
          <Styled.LinkText>{t(link.label)}</Styled.LinkText>
        </Styled.Link>
      </li>
    );
  };

  return (
    <Styled.Wrapper $visible={visible} ref={ref} {...dropDownProps}>
      <Styled.List>
        {links.map(link => {
          if (link.ability)
            return (
              <Authorize
                key={`${link.label}-wrapped`}
                entity={link.entity}
                ability={link.ability}
              >
                {renderItem(link)}
              </Authorize>
            );
          return renderItem(link);
        })}
      </Styled.List>
    </Styled.Wrapper>
  );
}

ProjectsSecondaryNav.displayName = "Layout.Projects.SecondaryNav";

export default forwardRef(ProjectsSecondaryNav);
