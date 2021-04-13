import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { NavLink } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";

function ChildNav({ readingGroup }) {
  const homePaths = {
    static: lh.link("frontendReadingGroupHomepageStatic", readingGroup.id),
    edit: lh.link("frontendReadingGroupHomepageEdit", readingGroup.id)
  };

  const links = [
    {
      to: homePaths.static,
      text: "Home",
      icon: "star24",
      exact: false,
      isActive: (match, location) => {
        if (!match) return false;
        const isHomePath = Object.values(homePaths).includes(location.pathname);
        return isHomePath;
      }
    },
    {
      to: lh.link("frontendReadingGroupAnnotations", readingGroup.id),
      text: "Notes + Comments",
      icon: "notes24",
      exact: true,
      isActive: null
    },
    {
      to: lh.link("frontendReadingGroupMembers", readingGroup.id),
      text: "Members",
      icon: "readingGroup24",
      exact: true,
      isActive: null
    }
  ];
  return (
    <nav aria-label="Reading Group subpages" className="group-child-nav">
      {links.map(({ to, exact, isActive, text, icon }) => (
        <NavLink
          key={text}
          to={to}
          exact={exact}
          isActive={isActive}
          className="group-child-nav__link"
          activeClassName="group-child-nav__link--active"
        >
          <IconComposer icon={icon} size="default" />
          <span className="group-child-nav__link-text">{text}</span>
        </NavLink>
      ))}
    </nav>
  );
}

ChildNav.displayName = "ReadingGroup.Heading.ChildNav";

ChildNav.propTypes = {
  readingGroup: PropTypes.object.isRequired
};

export default ChildNav;
