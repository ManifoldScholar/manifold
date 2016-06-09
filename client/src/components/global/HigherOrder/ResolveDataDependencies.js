import React, { Component, PropTypes } from 'react';
import { RouterContext } from 'react-router';
import { isFunction } from 'lodash';

export default class ResolveDataDependencies extends Component {

  static propTypes = {
    components: PropTypes.array
  };

  static contextTypes = {
    store: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.createElement = this.createElement.bind(this);
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
