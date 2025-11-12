import React from "react";
import PropTypes from "prop-types";
import { Redirect, Outlet, useOutletContext } from "react-router-dom";
import lh from "helpers/linkHandler";

function ReadingGroupsMembersContainer() {
  const { readingGroup, ...restProps } = useOutletContext() || {};
  const { abilities, currentUserRole } = readingGroup?.attributes || {};
  const canUpdateGroup = abilities?.update;
  const userIsGroupMember = canUpdateGroup || currentUserRole !== "none";

  if (!userIsGroupMember) {
    return (
      <Redirect to={lh.link("frontendReadingGroupDetail", readingGroup.id)} />
    );
  }

  return <Outlet context={{ readingGroup, ...restProps }} />;
}

export default ReadingGroupsMembersContainer;
