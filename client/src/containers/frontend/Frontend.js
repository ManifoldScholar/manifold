import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { HigherOrder, FatalError } from 'components/global';
import { Layout } from 'components/frontend';
import { commonActions } from 'actions/helpers';
import { pagesAPI, subjectsAPI } from 'api';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import get from 'lodash/get';
const { request, requests } = entityStoreActions;

class FrontendContainer extends Component {

  static fetchData(getState, dispatch) {
    if (!entityUtils.isLoaded(requests.allPages, getState())) {
      const pages = request(pagesAPI.index(), requests.allPages, { oneTime: true });
      const subjects = request(
        subjectsAPI.index({ used: true }),
        requests.allUsedSubjects,
        { oneTime: true }
      );
      const { promise: one } = dispatch(pages);
      const { promise: two } = dispatch(subjects);
      return Promise.all([one, two]);
    }
  }

  static propTypes = {
    routeDataLoaded: PropTypes.bool,
    routing: PropTypes.object,
    children: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    authentication: PropTypes.object,
    visibility: PropTypes.object,
    loading: PropTypes.bool,
    notifications: PropTypes.object,
    history: PropTypes.object.isRequired,
    renderDevTools: PropTypes.bool,
    pages: PropTypes.array,
    settings: PropTypes.object
  };

  static mapStateToProps(state) {
    return {
      authentication: state.authentication,
      visibility: state.ui.visibility,
      loading: state.ui.loading.active,
      notifications: state.notifications,
      routing: state.routing,
      pages: entityUtils.select(requests.allPages, state.entityStore),
      settings: entityUtils.select(requests.settings, state.entityStore)
    };
  }

  componentWillMount() {
    this.commonActions = commonActions(this.props.dispatch);
  }

  componentDidMount() {
    this.setMinHeight();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.routing.locationBeforeTransitions.key !==
      nextProps.routing.locationBeforeTransitions.key) {
      window.scrollTo(0, 0);
    }
  }

  setMinHeight() {
    const mainHeight = this.refs.mainContainer.offsetHeight;
    const offsetHeight = this.refs.mainContainer.parentNode.offsetHeight - mainHeight;
    this.refs.mainContainer.style.minHeight = `calc(100vh - ${offsetHeight}px)`;
  }

  render() {
    const fatalError = this.props.notifications.fatalError;

    return (
      <HigherOrder.BodyClass className={'browse'}>
        <div>
          <HigherOrder.ScrollAware>
            <Layout.Header
              visibility={this.props.visibility }
              location={this.props.location}
              authentication={this.props.authentication}
              notifications={this.props.notifications}
              commonActions={this.commonActions}
              settings={this.props.settings}
            />
          </HigherOrder.ScrollAware>
          <Layout.MobileNav location={this.props.location} />
          <main ref="mainContainer">
            { (fatalError) ?
              <div className="global-container">
                <FatalError error={fatalError} />
              </div>
              :
              this.props.children
            }
          </main>
          <Layout.Footer
            pages={this.props.pages}
            authentication={this.props.authentication}
            commonActions={this.commonActions}
          />
        </div>
      </HigherOrder.BodyClass>
    );
  }
}

const Frontend = connect(
  FrontendContainer.mapStateToProps
)(FrontendContainer);

export default Frontend;
