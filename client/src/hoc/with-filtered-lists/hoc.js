import React, { Component } from "react";
import hoistStatics from "hoist-non-react-statics";
import memoize from "lodash/memoize";
import isPlainObject from "lodash/isPlainObject";
import pickBy from "lodash/pickBy";
import identity from "lodash/identity";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

function withFilters(WrappedComponent, filteredLists = {}) {
  const displayName = `HigherOrder.WithFilters('${getDisplayName(
    WrappedComponent
  )})`;

  class WithFilters extends Component {
    static WrappedComponent = WrappedComponent;
    static displayName = displayName;

    static propTypes = {};

    constructor(props) {
      super(props);
      this.state = this.initialState;
    }

    onReset = key => {
      this.setValues(key, this.initialValues(key));
    };

    get managedLists() {
      return Object.keys(filteredLists);
    }

    get initialState() {
      const state = {};
      this.managedLists.forEach(list => {
        const listState = filteredLists[list]();
        listState.values = {};
        listState.params.forEach(param => {
          listState.values[param.name] = param.value;
          /* eslint-disable no-param-reassign */
          delete param.value;
          /* eslint-disable no-param-reassign */
        });
        listState.initialValues = listState.values;
        state[list] = listState;
      });
      return state;
    }

    setParam = (key, paramLike, value) => {
      const param = this.ensureParamObject(key, paramLike);
      this.setValues(key, { [param.name]: value });
    };

    setValues(key, updatedValues) {
      const listState = this.listState(key);
      const values = listState.values;
      const newValues = Object.assign({}, values, updatedValues);
      const newListState = Object.assign({}, listState, { values: newValues });
      this.setState({ [key]: newListState });
    }

    initialValues(key) {
      const listState = filteredLists[key]();
      const values = {};
      listState.params.forEach(param => {
        values[param.name] = param.value;
      });
      return values;
    }

    entitiesListSearchProps = key => {
      return {
        onReset: this.buildMemoizedHandler("onReset", key),
        setParam: this.buildMemoizedHandler("setParam", key),
        params: this.paramsFor(key),
        values: this.valuesFor(key)
      };
    };

    entitiesListSearchParams = memoize(stateIgnored => {
      const params = {};
      this.managedLists.forEach(key => {
        params[key] = this.requestParams(key);
        params[`initial${key}`] = this.initialRequestParams(key);
      });
      return params;
    });

    listState(key) {
      return this.state[key];
    }

    paramsFor(key) {
      return this.listState(key).params || [];
    }

    valuesFor(key) {
      return this.listState(key).values || {};
    }

    requestParams(key) {
      return pickBy(this.listState(key).values, identity);
    }

    initialRequestParams(key) {
      return pickBy(this.listState(key).initialValues, identity);
    }

    paramByName(key, paramName) {
      const params = this.paramsFor(key);
      return params.find(p => p.name === paramName);
    }

    ensureParamObject(key, paramLike) {
      const name = isPlainObject(paramLike) ? paramLike.name : paramLike;
      return this.paramByName(key, name);
    }

    buildMemoizedHandler = memoize((name, key) => {
      const handler = this[name];
      return (...args) => {
        return handler(key, ...args);
      };
    });

    paramsFor = key => {
      return this.state[key].params;
    };

    render() {
      return (
        <React.Fragment>
          <WrappedComponent
            {...this.props}
            entitiesListSearchProps={this.entitiesListSearchProps}
            entitiesListSearchParams={this.entitiesListSearchParams(this.state)}
          />
        </React.Fragment>
      );
    }
  }

  return hoistStatics(WithFilters, WrappedComponent);
}

export default withFilters;
