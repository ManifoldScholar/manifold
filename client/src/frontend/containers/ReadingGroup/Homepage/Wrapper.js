import React from "react";
import PropTypes from "prop-types";
import { Redirect, Outlet, useOutletContext } from "react-router-dom";
import lh from "helpers/linkHandler";
import { hasItemsInCollection } from "frontend/components/collecting/helpers";

/*
Some RGs may choose to only use annotation features and not do any collecting.
In such cases we'll just redirect to the annotations page (except for moderators,
who have collecting privileges) rather than show the empty homepage.
*/
function ReadingGroupHomepageContainer() {
  const { readingGroup, ...restProps } = useOutletContext() || {};
  const canUpdateGroup = readingGroup?.attributes?.abilities?.update;
  const showHomepage = canUpdateGroup || hasItemsInCollection(readingGroup);

  if (!showHomepage)
    return (
      <Redirect
        to={lh.link("frontendReadingGroupAnnotations", readingGroup.id)}
      />
    );

  return <Outlet context={{ readingGroup, ...restProps }} />;
}

export default ReadingGroupHomepageContainer;
