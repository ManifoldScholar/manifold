import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { HigherOrder, FatalError } from 'components/global';
import { Layout as LayoutFrontend } from 'components/frontend';
import { Layout as LayoutBackend } from 'components/backend';
import { commonActions } from 'actions/helpers';
import { pagesAPI } from 'api';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
const { request, requests } = entityStoreActions;

class BackendContainer extends PureComponent {

  static fetchData(getState, dispatch) {
    if (!entityUtils.isLoaded(requests.allPages, getState())) {
      const pages = request(pagesAPI.index(), requests.allPages, true);
      const { promise: one } = dispatch(pages);
      return Promise.all([one]);
    }
  }

  static propTypes = {
    routeDataLoaded: PropTypes.bool,
    children: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    authentication: PropTypes.object,
    visibility: PropTypes.object,
    loading: PropTypes.bool,
    notifications: PropTypes.object,
    history: PropTypes.object.isRequired,
    pages: PropTypes.array
  };

  static mapStateToProps(state) {
    return {
      authentication: state.authentication,
      visibility: state.ui.visibility,
      loading: state.ui.loading.active,
      notifications: state.notifications,
      routing: state.routing,
      pages: entityUtils.select(requests.allPages, state.entityStore)
    };
  }

  componentWillMount() {
    this.commonActions = commonActions(this.props.dispatch);
  }

  componentDidMount() {
    this.setMinHeight();
  }

  setMinHeight() {
    const mainHeight = this.refs.mainContainer.offsetHeight;
    const offsetHeight = this.refs.mainContainer.parentNode.offsetHeight - mainHeight;
    this.refs.mainContainer.style.minHeight = `calc(100vh - ${offsetHeight}px)`;
  }

  render() {
    const fatalError = this.props.notifications.fatalError;

    return (
      <HigherOrder.BodyClass className={'backend bg-neutral90'}>
        <div>
          <HigherOrder.ScrollAware>
            <LayoutBackend.Header
              visibility={this.props.visibility}
              location={this.props.location}
              authentication={this.props.authentication}
              notifications={this.props.notifications}
              commonActions={this.commonActions}
            />
          </HigherOrder.ScrollAware>
          <main ref="mainContainer">
            { (fatalError) ?
              <div className="global-container">
                <FatalError error={fatalError} />
              </div>
              :
              this.props.children
            }
          </main>
          <LayoutFrontend.Footer
            pages={this.props.pages}
            authentication={this.props.authentication}
            commonActions={this.commonActions}
          />
        </div>
      </HigherOrder.BodyClass>
    );
  }
}

const Backend = connect(
  BackendContainer.mapStateToProps
)(BackendContainer);

export default Backend;
