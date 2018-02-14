import React from "react";
import PropTypes from "prop-types";
import hoistStatics from "hoist-non-react-statics";
import { isFunction } from "lodash";
import { isPromise } from "utils/promise";
import ch from "helpers/consoleHelpers";

function getDisplayName(WrappedComponent) {
  let Wrapped = WrappedComponent;
  if (WrappedComponent.WrappedComponent) {
    Wrapped = WrappedComponent.WrappedComponent;
  }
  return Wrapped.displayName || Wrapped.name || "Component";
}

export default function fetchData(WrappedComponent) {
  const displayName = `HigherOrder.FetchData('${getDisplayName(
    WrappedComponent
  )})`;

  class FetchData extends React.PureComponent {
    static displayName = displayName;

    static contextTypes = {
      store: PropTypes.object
    };

    static WrappedComponent = WrappedComponent;

    static propTypes = {
      location: PropTypes.object,
      staticContext: PropTypes.object,
      match: PropTypes.object
    };

    componentWillMount() {
      this.fetchData(this.props);
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.match.url !== nextProps.match.url) {
        this.fetchData(nextProps);
      }
    }

    addFetchResultToStaticContext(result) {
      if (!this.props.staticContext) return;
      const promises = [];
      if (isPromise(result)) promises.push(result);
      if (Array.isArray(result)) {
        result.forEach(aResult => {
          if (isPromise(aResult)) promises.push(aResult);
        });
      }
      promises.forEach(promise => {
        this.props.staticContext.fetchDataPromises.push(promise);
      });
    }

    log(props) {
      if (process.env.NODE_ENV === "development" && __CLIENT__) {
        ch.notice(
          `FetchData: ${getDisplayName(WrappedComponent)} [${props.location
            .key}]`,
          "floppy_disk"
        );
      }
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

    canFetchData(propsIgnored) {
      if (!isFunction(WrappedComponent.fetchData)) return false;
      return true;
    }

    render() {
      const props = Object.assign({}, this.props);
      return React.createElement(WrappedComponent, props);
    }
  }

  return hoistStatics(FetchData, WrappedComponent);
}
