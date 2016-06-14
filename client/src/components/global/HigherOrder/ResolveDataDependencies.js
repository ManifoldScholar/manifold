import React, { Component, PropTypes } from 'react';
import { RouterContext } from 'react-router';
import { isFunction } from 'lodash';
import { connect } from 'react-redux';

class ResolveDataDependenciesComponent extends Component {

  static propTypes = {
    components: PropTypes.array,
    authentication: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.createElement = this.createElement.bind(this);
  }

  shouldComponentUpdate(nextProps) {
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
