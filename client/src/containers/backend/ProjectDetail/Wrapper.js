import React, { PureComponent, PropTypes } from 'react';
import { Project, Navigation } from 'components/backend';
import { connect } from 'react-redux';
import { uiVisibilityActions, entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI } from 'api';
import get from 'lodash/get';

const { select } = entityUtils;
const { request, flush, requests } = entityStoreActions;

class ProjectDetailWrapperContainer extends PureComponent {

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

  constructor(props) {
    super(props);
    this.fetchProject = this.fetchProject.bind(this);
  }

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

  secondaryNavigationLinks(project) {
    return [
      {
        path: `/backend/project/${project.id}/`,
        label: "General",
        key: "general"
      },
      {
        path: `/backend/project/${project.id}/collaborators`,
        label: "People",
        key: "collaborators"
      },
      {
        path: `/backend/project/${project.id}/texts`,
        label: "Texts",
        key: "texts"
      },
      {
        path: `/backend/project/${project.id}/resources`,
        label: "Resources",
        key: "resources"
      },
      {
        path: `/backend/project/${project.id}/metadata`,
        label: "Metadata",
        key: "metadata"
      }
    ];
  }

  render() {
    if (!this.props.project) return null;
    const { project } = this.props;

    return (
      <div>
        <Navigation.DetailHeader
          type="project"
          breadcrumb={[
            { path: "/backend", label: "ALL PROJECTS" }
          ]}
          title={project.attributes.title}
          subtitle={project.attributes.subtitle}
        />
        <section className="backend-panel">
          <aside className="scrollable">
            <div className="wrapper">
              <Navigation.Secondary
                links={this.secondaryNavigationLinks(project)}
                active={this.activeChild()}
              />
            </div>
          </aside>
          <div className="container">
            <aside className="aside">
              <Navigation.Secondary
                links={this.secondaryNavigationLinks(project)}
                active={this.activeChild()}
              />
            </aside>
            <div className="panel">
              {
                React.cloneElement(
                  this.props.children,
                  { project, refresh: this.fetchProject }
                )
              }
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connect(
  ProjectDetailWrapperContainer.mapStateToProps
)(ProjectDetailWrapperContainer);

