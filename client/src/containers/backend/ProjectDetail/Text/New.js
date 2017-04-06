import React, { PureComponent, PropTypes } from 'react';
import connectAndFetch from 'utils/connectAndFetch';
import { renderRoutes } from 'helpers/routing';

class ProjectDetailTextNew extends PureComponent {

  static displayName = "ProjectDetail.Text.New";

  renderRoutes() {
    const { refresh, project } = this.props;
    const childRoutes = renderRoutes(this.props.route.routes, { refresh, project });
    return childRoutes;
  }

  render() {
    const { match } = this.props;
    return (
      <div>
        {this.renderRoutes()}
      </div>
    );
  }
}

export default connectAndFetch(ProjectDetailTextNew);
