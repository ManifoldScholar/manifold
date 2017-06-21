import React, { PropTypes } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { isFunction } from 'lodash';
import { isPromise } from 'utils/promise';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function fetchData(WrappedComponent) {
  const displayName = `HigherOrder.FetchData('${getDisplayName(WrappedComponent)})`;

  class FetchData extends React.PureComponent {

    static displayName = displayName;

    static contextTypes = {
      store: PropTypes.object
    };

    static WrappedComponent = WrappedComponent;

    static propTypes = {
      location: PropTypes.object,
      match: PropTypes.object,
    };

    constructor(props) {
      super(props);
    }

    canFetchData(props) {
      // if (!props.location.key) return false;
      if (!isFunction(WrappedComponent.fetchData)) return false;
      return true;
    }

    fetchData(props) {
      if (!this.canFetchData(props)) return;
      const result = WrappedComponent.fetchData(
        this.context.store.getState,
        this.context.store.dispatch,
        props.location,
        props.match
      );
      this.addFetchResultToStaticContext(result);
      this.log(props);
    }

    addFetchResultToStaticContext(result) {
      if (!this.props.staticContext) return;
      const promises = [];
      if (isPromise(result)) promises.push(result);
      if (Array.isArray(result)) {
        result.forEach((aResult) => {
          if (isPromise(aResult)) promises.push(aResult);
        });
      }
      promises.forEach((promise) => {
        this.props.staticContext.fetchDataPromises.push(promise);
      });
    }

    log(props) {
      if (process.env.NODE_ENV === "development" && __CLIENT__) {
        console.log(`💾 FetchData: ${getDisplayName(WrappedComponent)} [${props.location.key}]`);
      }
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.match.url !== nextProps.match.url) {
        this.fetchData(nextProps);
      }
    }

    componentWillMount() {
      this.fetchData(this.props);
    }

    render() {
      const props = Object.assign({}, this.props);
      return React.createElement(WrappedComponent, props);
    }
  }

  return hoistStatics(FetchData, WrappedComponent);

}
