import React, { Component, PropTypes } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { renderRoutes } from 'helpers/routing';

class ProjectDetailCategoryWrapper extends Component {

  static displayName = "ProjectDetail.Category.Wrapper";

  static propTypes = {
    project: PropTypes.object.isRequired,
    refresh: PropTypes.func,
    route: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {renderRoutes(this.props.route.routes, this.props)}
      </div>
    );
  }
}

export default withRouter(ProjectDetailCategoryWrapper);
