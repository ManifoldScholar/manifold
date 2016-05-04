import React, { Component, PropTypes } from 'react';
import { isFunction } from '../../../../node_modules/lodash/lang';
import { matches } from '../../../../node_modules/lodash/utility';


export default class DelayContainer extends Component {

  static propTypes = {
    store: PropTypes.object,
    routerProps: PropTypes.object,
    component: PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this._isMounted = false;
    this.state = {
      loaded: false
    };
  }

  componentWillMount() {
    if (!this.shouldFetchData(null, this.props)) {
      this.loadingComplete();
      return;
    }
    this.doFetchData(this.props);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillReceiveProps(nextProps) {
    if (!this.shouldFetchData(this.props, nextProps)) {
      this.loadingComplete();
      return;
    }
    this.doFetchData(nextProps);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  clientLoaded(store) {
    return store.getState().isomorphic.loadState === 'CLIENT_LOADED';
  }

  shouldFetchData(props, nextProps) {
    // Don't fetch data if we're in the client, but the client hasn't fully rendered,
    // since the data is already present from the server-side load.
    if (__CLIENT__ && !this.clientLoaded(nextProps.store)) return false;
    // Do fetch data if we're receiving new props, but have no current props.
    if (!props) return true;
    // Don't fetch data if all that changed is the hash
    if (
      props.routerProps.location.pathname === nextProps.routerProps.location.pathname &&
      matches(props.routerProps.location.query, nextProps.routerProps.location.query)
    ) return false;
    return true;
  }

  loadingComplete() {
    if (!this._isMounted && this.clientLoaded(this.props.store)) return;
    this.setState({
      loaded: true
    });
  }

  loadingStart() {
    if (!this._isMounted && this.clientLoaded(this.props.store)) return;
    this.setState(Object.assign({}, {
      loaded: false
    }));
  }

  doFetchData(props) {
    const component = props.component;
    if (component && isFunction(component.fetchData)) {
      const promises = [];
      this.loadingStart();
      promises.push(component.fetchData(props.store.getState,
        props.store.dispatch,
        props.routerProps.location,
        props.routerProps.params
      ));
      Promise.all(promises).then(() => {
        this.loadingComplete();
      });
    } else {
      this.loadingComplete();
    }
  }

  render() {
    const ComponentClass = this.props.component;
    if (this.state.loaded === true || __SERVER__) {
      return (
        <ComponentClass routeDataLoaded={this.state.loaded} {... this.props.routerProps} />
      );
    }
    return null;
  }
}
