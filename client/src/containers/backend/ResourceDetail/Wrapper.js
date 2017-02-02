import React, { PureComponent, PropTypes } from 'react';
import { Text, Navigation } from 'components/backend';
import { connect } from 'react-redux';
import { uiVisibilityActions, entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { resourcesAPI } from 'api';
import get from 'lodash/get';

const { select } = entityUtils;
const { request, flush, requests } = entityStoreActions;

class ResourceDetailWrapperContainer extends PureComponent {

  static displayName = "ResourceDetail.Wrapper";

  static mapStateToProps(state, ownProps) {
    return {
      resource: select(requests.showResourceDetail, state.entityStore)
    };
  }

  static propTypes = {
    children: PropTypes.object,
    resource: PropTypes.object
  };

  componentDidMount() {
    this.fetchResource();
  }

  componentWillUnmount() {
    this.props.dispatch(entityStoreActions.flush(requests.showResourceDetail));
  }

  fetchResource() {
    const call = resourcesAPI.show(this.props.params.id);
    const resourceRequest = request(call, requests.showResourceDetail);
    this.props.dispatch(resourceRequest);
  }

  activeChild() {
    return get(this.props, 'children.type.activeNavItem');
  }

  secondaryNavigationLinks(resource) {
    return [
      {
        path: `/backend/resources/${resource.id}/`,
        label: "General",
        key: "general"
      },
      {
        path: `/backend/text/${resource.id}/tbd`,
        label: "TBD",
        key: "tbd"
      }
    ];
  }

  render() {
    if (!this.props.resource) return null;
    const { resource } = this.props;

    return (
      <div>
        <Navigation.DetailHeader
          type="resource"
          breadcrumb={[
            { path: "/backend", label: "ALL PROJECTS" },
            {
              path: `/backend/project/${resource.relationships.project.id}/resources`,
              label: resource.relationships.project.attributes.title
            }
          ]}
          title={resource.attributes.title}
          subtitle={resource.attributes.subtitle}
        />
        <section className="backend-panel">
          <aside className="scrollable">
            <div className="wrapper">
              <Navigation.Secondary
                links={this.secondaryNavigationLinks(resource)}
                active={this.activeChild()}
              />
            </div>
          </aside>
          <div className="container">
            <aside className="aside">
              <Navigation.Secondary
                links={this.secondaryNavigationLinks(resource)}
                active={this.activeChild()}
              />
            </aside>
            <div className="panel">
              {React.cloneElement(this.props.children, { resource })}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connect(
  ResourceDetailWrapperContainer.mapStateToProps
)(ResourceDetailWrapperContainer);

