import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import Switch from "global/components/form/Switch";
import ActionBox from "frontend/components/reading-group/ActionBox";

function HeadingManageGroup({ readingGroup, history, location }) {
  const homepageStaticPath = lh.link(
    "frontendReadingGroupHomepageStatic",
    readingGroup.id
  );
  const homepageEditPath = lh.link(
    "frontendReadingGroupHomepageEdit",
    readingGroup.id
  );
  const inEditMode = location.pathname === homepageEditPath;

  function handleSwitchChange() {
    if (!inEditMode) return history.push(homepageEditPath);
    history.push(homepageStaticPath);
  }

  return (
    <ActionBox
      title="Manage group:"
      instructions="Edit the Home Page or the settings for your Reading Group."
      actions={
        <div className="group-page-heading__flex-container group-page-heading__flex-container--justify-start">
          <div aria-hidden>
            <Switch
              label="Edit Home Page:"
              set={handleSwitchChange}
              value={inEditMode}
              className="group-homepage-mode-toggle"
            />
          </div>
          <Link
            to={homepageStaticPath}
            className="screen-reader-text"
            tabIndex={-1}
          >
            View group homepage
          </Link>
          <Link
            to={homepageEditPath}
            className="screen-reader-text"
            tabIndex={-1}
          >
            Edit group homepage
          </Link>
          <a href="#settings" className="group-settings-link">
            Edit settings
          </a>
        </div>
      }
    />
  );
}

HeadingManageGroup.displayName = "ReadingGroup.Heading.ManageGroup";

HeadingManageGroup.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default HeadingManageGroup;
