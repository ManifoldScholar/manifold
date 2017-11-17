import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { renderRoutes } from "helpers/routing";

class ProjectCategoryWrapperContainer extends Component {
  static displayName = "Project.Category.Wrapper";

  static propTypes = {
    route: PropTypes.object
  };

  render() {
    return (
      <div>
        {renderRoutes(this.props.route.routes, this.props)}
      </div>
    );
  }
}

export default withRouter(ProjectCategoryWrapperContainer);
