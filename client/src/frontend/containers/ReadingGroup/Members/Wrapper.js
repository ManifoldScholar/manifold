import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";

function ReadingGroupsMembersContainer({ route, readingGroup, ...restProps }) {
  const { abilities, currentUserRole } = readingGroup.attributes;
  const canUpdateGroup = abilities.update;
  const userIsGroupMember = canUpdateGroup || currentUserRole !== "none";

  if (!userIsGroupMember) {
    return (
      <Redirect to={lh.link("frontendReadingGroupDetail", readingGroup.id)} />
    );
  }

  return childRoutes(route, {
    childProps: {
      readingGroup,
      ...restProps
    }
  });
}

ReadingGroupsMembersContainer.propTypes = {
  route: PropTypes.object.isRequired,
  readingGroup: PropTypes.object.isRequired
};

export default ReadingGroupsMembersContainer;
