import React, { Component, PropTypes } from 'react';
import RoutingContext from '../../../../node_modules/react-router/lib/RoutingContext';
import { isFunction } from '../../../../node_modules/lodash/lang';

class DelayContainer extends Component {

  static propTypes = {
    store: PropTypes.object,
    routerProps: PropTypes.object,
    component: PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      loaded: false,
    };
  }

  componentWillMount = () => {
    const state = this.props.store.getState();
    const routeChanged = state.isomorphic.fetchedRoute !== this.props.routerProps.location.pathname;
    if (!routeChanged) {
      this.loadingComplete();
      return;
    }
    this.doFetchData(this.props);
  };

  componentWillReceiveProps = (nextProps) => {
    const state = nextProps.store.getState();
    const routeChanged = state.isomorphic.fetchedRoute !== state.routing.location.pathname;
    console.log(state.isomorphic.fetchedRoute, 'a');
    console.log(state.routing.location.pathname, 'b');
    console.log(routeChanged, 'route changed');
    if (!routeChanged) {
      this.loadingComplete();
      return;
    }
    this.doFetchData(nextProps);
  };

  loadingComplete = () => {
    this.setState({
      loaded: true
    });
  };

  loadingStart = () => {
    this.setState(Object.assign({}, {
      loaded: false
    }));
  };

  doFetchData = (props) => {
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
  };

  render() {
    const ComponentClass = this.props.component;
    if (this.state.loaded === true) {
      return (
        <ComponentClass routeDataLoaded={this.state.loaded} {... this.props.routerProps} />
      );
    }
    return null;
  }
}

export default class ResolveDataDependencies extends Component {

  static propTypes = {
  };

  static contextTypes = {
    store: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
  }

  createElement = (ComponentClass, props) => {
    if (isFunction(ComponentClass.fetchData) || isFunction(ComponentClass.fetchDataDeferred)) {
      return (
        <DelayContainer store={this.context.store} component={ComponentClass} routerProps={props} />
      );
    }
    return <ComponentClass {...props}/>;
  };

  render() {
    return (
      <RoutingContext {...this.props} createElement={this.createElement}/>
    );
  }
}
