import React, { Component, PropTypes } from 'react';
import { RouterContext } from 'react-router';
import { isFunction } from 'lodash';
import { connect } from 'react-redux';

class ResolveDataDependenciesComponent extends Component {

  static propTypes = {
    components: PropTypes.array,
    authenticated: PropTypes.bool,
    location: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.createElement = this.createElement.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    // Watch this next line carefully. It might be too aggressive. The idea is that
    // we don't trigger fetching data unless the route has changed in some way. Without
    // this, changes to the anchor in the URL will refetch data.
    if (this.props.location.pathname === nextProps.location.pathname) return false;
    if (this.props.components !== nextProps.components) return true;
    if (this.props.authenticated !== nextProps.authenticated) return true;
    return false;
  }

  createElement(ComponentClass, props) {
    setTimeout(() => {
      if (isFunction(ComponentClass.fetchData)) {
        ComponentClass.fetchData(
          this.context.store.getState,
          this.context.store.dispatch,
          props.location,
          props.params
        );
      }
    });
    return <ComponentClass {...props}/>;
  }

  cleanedComponents() {
    return this.props.components.filter(Boolean);
  }

  render() {
    const createElement = this.createElement;
    const newProps = { ...this.props, createElement, components: this.cleanedComponents() };
    return (
      <RouterContext {...newProps} />
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.authentication.authenticated
  };
}

const ResolveDataDependencies = connect(
  mapStateToProps
)(ResolveDataDependenciesComponent);

export default ResolveDataDependencies;
