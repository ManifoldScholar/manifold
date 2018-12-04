import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { childRoutes } from "helpers/router";

class ProjectCategoryWrapperContainer extends Component {
  static displayName = "Project.Category.Wrapper";

  static propTypes = {
    project: PropTypes.object,
    history: PropTypes.object,
    route: PropTypes.object
  };

  render() {
    return (
      <div>{childRoutes(this.props.route, { childProps: this.props })}</div>
    );
  }
}

export default withRouter(ProjectCategoryWrapperContainer);
