import React from "react";
import PropTypes from "prop-types";
import { childRoutes } from "helpers/router";
import { withRouter } from "react-router-dom";

function JournalIssueWrapper({ route, ...props }) {
  return <div>{childRoutes(route, { childProps: props })}</div>;
}

JournalIssueWrapper.propTypes = {
  journal: PropTypes.object,
  history: PropTypes.object,
  route: PropTypes.object
};

export default withRouter(JournalIssueWrapper);
