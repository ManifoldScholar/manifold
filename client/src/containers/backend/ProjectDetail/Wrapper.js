import React, { PureComponent, PropTypes } from 'react';
import { Project, Layout } from 'components/backend';
import { connect } from 'react-redux';
import { uiVisibilityActions, entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI } from 'api';
import get from 'lodash/get';

const { select } = entityUtils;
const { request, flush, requests } = entityStoreActions;

class ProjectPanelsContainer extends PureComponent {

  static displayName = "ProjectDetail.Wrapper";

  static mapStateToProps(state, ownProps) {
    return {
      project: select(requests.showProjectDetail, state.entityStore)
    };
  }

  static propTypes = {
    children: PropTypes.object,
    project: PropTypes.object
  };

  componentDidMount() {
    this.fetchProject();
  }

  componentWillUnmount() {
    this.props.dispatch(entityStoreActions.flush(requests.showProjectDetail));
  }

  fetchProject() {
    const call = projectsAPI.show(this.props.params.id);
    const projectRequest = request(call, requests.showProjectDetail);
    this.props.dispatch(projectRequest);
  }

  activeChild() {
    return get(this.props, 'children.type.activeNavItem');
  }

  render() {
    if (!this.props.project) return null;
    const { project } = this.props;

    return (
      <div>
        <Project.Header
          project={project}
        />
        <section>
          <div className="container">
            <section className="backend-panel">
              <aside>
                <Project.Navigation
                  project={project}
                  active={this.activeChild()}
                />
              </aside>
              <div className="panel">
                {React.cloneElement(this.props.children, { project })}
              </div>
            </section>
          </div>
        </section>
      </div>
    );
  }
}

const ProjectPanels = connect(
  ProjectPanelsContainer.mapStateToProps
)(ProjectPanelsContainer);

export default ProjectPanels;

