import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { HigherOrder } from 'components/global';
import { Header, Footer } from 'components/frontend';
import { commonActions } from 'actions/helpers';

class FrontendContainer extends Component {

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
    renderDevTools: PropTypes.bool
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

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
    return (
      <HigherOrder.BodyClass className={'browse'}>
        <div>
          <Header
            visibility={this.props.visibility }
            location={this.props.location}
            authentication={this.props.authentication}
            notifications={this.props.notifications}
            commonActions={this.commonActions}
          />
          <main ref="mainContainer">
            {this.props.children}
          </main>
          <Footer commonActions={this.commonActions} />
        </div>
      </HigherOrder.BodyClass>
    );
  }
}

function mapStateToProps(state) {
  return {
    authentication: state.authentication,
    visibility: state.ui.visibility,
    loading: state.ui.loading.active,
    notifications: state.notifications,
    routing: state.routing
  };
}

const Frontend = connect(
  mapStateToProps
)(FrontendContainer);

export default Frontend;
