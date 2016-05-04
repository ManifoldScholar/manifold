import React, { Component, PropTypes } from 'react';
import { RouterContext } from 'react-router';
import { isFunction } from '../../../../node_modules/lodash/lang';
import DelayContainer from './DelayContainer';

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
    if (isFunction(ComponentClass.fetchData) || isFunction(ComponentClass.fetchDataDeferred)) {
      return (
        <DelayContainer store={this.context.store} component={ComponentClass} routerProps={props} />
      );
    }
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
