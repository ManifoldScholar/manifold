import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { Navigation } from "../parts";

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
  return <Navigation ariaLabel="Reading Group subpages" links={links} />;
}

ChildNav.displayName = "ReadingGroup.Heading.ChildNav";

ChildNav.propTypes = {
  readingGroup: PropTypes.object.isRequired
};

export default ChildNav;
