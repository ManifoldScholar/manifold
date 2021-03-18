import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { NavLink } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";

function ChildNav({ readingGroup }) {
  const links = [
    {
      to: lh.link("frontendReadingGroupDetail", readingGroup.id),
      text: "Home",
      icon: "star24"
    },
    {
      to: lh.link("frontendReadingGroupAnnotations", readingGroup.id),
      text: "Notes + Comments",
      icon: "notes24"
    },
    {
      to: lh.link("frontendReadingGroupMembers", readingGroup.id),
      text: "Members",
      icon: "readingGroup24"
    }
  ];
  return (
    <nav aria-label="Reading Group subpages" className="group-child-nav">
      {links.map(({ to, text, icon }) => (
        <NavLink
          key={text}
          to={to}
          exact
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
