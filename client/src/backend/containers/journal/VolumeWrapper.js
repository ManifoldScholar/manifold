import React from "react";
import PropTypes from "prop-types";
import { childRoutes } from "helpers/router";
import { withRouter } from "react-router-dom";

function JournalVolumeWrapper({ route, ...props }) {
  return <div>{childRoutes(route, { childProps: props })}</div>;
}

JournalVolumeWrapper.propTypes = {
  journal: PropTypes.object,
  history: PropTypes.object,
  route: PropTypes.object
};

export default withRouter(JournalVolumeWrapper);
