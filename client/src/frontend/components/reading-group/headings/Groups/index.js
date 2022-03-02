import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import lh from "helpers/linkHandler";
import { Navigation, Title } from "../parts";

function GroupsHeading({ currentUser }) {
  const { t } = useTranslation();

  const links = [
    {
      to: lh.link("frontendMyReadingGroups"),
      text: t("navigation.reading_group.my_groups"),
      exact: false
    },
    {
      to: lh.link("frontendPublicReadingGroups"),
      text: t("navigation.reading_group.public_groups"),
      exact: true
    }
  ];

  return (
    <header className="group-page-heading">
      <div className="group-page-heading__container">
        <div className="group-page-heading__flex-container">
          {!currentUser && (
            <Title
              title={t("navigation.reading_group.public_groups")}
              icon="annotationGroup24"
            />
          )}
          {currentUser && (
            <>
              <Navigation
                ariaLabel={t("navigation.reading_group.label")}
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
                  {t("navigation.reading_group.create")}
                </NavLink>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

GroupsHeading.displayName = "ReadingGroup.GroupsHeading";

GroupsHeading.propTypes = {
  currentUser: PropTypes.object
};

export default GroupsHeading;
