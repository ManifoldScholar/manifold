import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import lh from "helpers/linkHandler";
import { Navigation } from "../parts";

function GroupsHeading() {
  const links = [
    {
      to: lh.link("frontendMyReadingGroups"),
      text: "My Reading Groups",
      exact: false
    },
    {
      to: lh.link("frontendPublicReadingGroups"),
      text: "Public Reading Groups",
      exact: true
    }
  ];

  return (
    <header className="group-page-heading">
      <div className="group-page-heading__container">
        <div className="group-page-heading__flex-container">
          <Navigation
            ariaLabel="Reading Groups subpages"
            links={links}
            layout="flex"
            padLinks
          />
          <div className="group-page-heading__button-container">
            <NavLink
              to={lh.link("frontendMyReadingGroupsNew")}
              className="group-page-heading__nav-button button-tertiary"
              activeClassName="button-tertiary--active"
            >
              Create New Group
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}

GroupsHeading.displayName = "ReadingGroup.GroupsHeading";

GroupsHeading.propTypes = {};

export default GroupsHeading;
