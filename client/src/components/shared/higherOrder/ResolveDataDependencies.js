import React, { Component, PropTypes } from 'react';
import { RouterContext } from 'react-router';
import { isFunction } from '../../../../node_modules/lodash/lang';

class DelayContainer extends Component {

  static propTypes = {
    store: PropTypes.object,
    routerProps: PropTypes.object,
    component: PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this._isMounted = false;
    this.state = {
      loaded: false,
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

  shouldFetchData(props, nextProps) {
    const isChangeAction = nextProps.routerProps.location.action === 'PUSH' ||
      nextProps.routerProps.location.action === 'POP';
    const pathChanged = !props ||
      props.routerProps.location.pathname !== nextProps.routerProps.location.pathname;
    return isChangeAction && pathChanged;
  }

  loadingComplete() {
    if (!this._isMounted) return;
    this.setState({
      loaded: true
    });
  }

  loadingStart() {
    if (!this._isMounted) return;
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
    const createElement = this.createElement;
    const newProps = { ...this.props, createElement };
    return (
      <RouterContext {...newProps} />
    );
  }
}
