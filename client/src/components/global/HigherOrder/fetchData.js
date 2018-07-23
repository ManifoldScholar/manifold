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
    static WrappedComponent = WrappedComponent;

    static displayName = displayName;

    static propTypes = {
      location: PropTypes.object,
      staticContext: PropTypes.object,
      match: PropTypes.object
    };

    static contextTypes = {
      store: PropTypes.object
    };

    componentDidMount() {
      this.fetchData(this.props);
    }

    componentDidUpdate(prevProps) {
      if (prevProps.match.url !== this.props.match.url) {
        this.fetchData(this.props);
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
          `FetchData: ${getDisplayName(WrappedComponent)} [${
            props.location.key
          }]`,
          "floppy_disk"
        );
      }
    }

    fetchData = props => {
      if (!this.canFetchData(props)) return;
      const result = WrappedComponent.fetchData(
        this.context.store.getState,
        this.context.store.dispatch,
        props.location,
        props.match
      );
      if (isPromise(result)) {
        result.catch(() => {
          ch.error(
            `Unable to fetch route data for ${getDisplayName(
              WrappedComponent
            )}`,
            "rain_cloud"
          );
        });
      }
      this.addFetchResultToStaticContext(result);
      this.log(props);
    };

    canFetchData(propsIgnored) {
      if (!isFunction(WrappedComponent.fetchData)) return false;
      return true;
    }

    render() {
      const props = Object.assign({}, this.props, {
        fetchData: this.fetchData
      });
      return React.createElement(WrappedComponent, props);
    }
  }

  return hoistStatics(FetchData, WrappedComponent);
}
