import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import has from "lodash/has";
import { currentUserActions } from "actions";
import Collecting from "frontend/components/collecting";

import withScreenReaderStatus from "hoc/with-screen-reader-status";

class ProjectFollow extends Component {
  static displayName = "Project.Follow";

  static propTypes = {
    authenticated: PropTypes.bool,
    favorites: PropTypes.object,
    dispatch: PropTypes.func,
    project: PropTypes.object
  };

  get followMessage() {
    return "You are now following this project";
  }

  get unfollowMessage() {
    return "You are no longer following this project.";
  }

  get selected() {
    return has(this.props.favorites, this.props.project.id);
  }

  get project() {
    return this.props.project;
  }

  get projectTitle() {
    return this.project.attributes.titlePlaintext;
  }

  render() {
    if (!this.props.authenticated) return null;
    return <Collecting.Toggle collectable />;
  }
}

export default withScreenReaderStatus(ProjectFollow);
