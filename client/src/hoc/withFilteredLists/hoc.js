import React, { Component } from "react";
import hoistStatics from "hoist-non-react-statics";
import memoize from "lodash/memoize";
import isPlainObject from "lodash/isPlainObject";
import pickBy from "lodash/pickBy";
import identity from "lodash/identity";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { uiStateSnapshotActions } from "actions";

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

    static mapStateToProps = state => {
      return { snapshots: state.ui.transitory.stateSnapshots };
    };

    static propTypes = {
      snapshot: PropTypes.object,
      dispatch: PropTypes.func
    };

    constructor(props) {
      super(props);
      this.state = this.initialState;
    }

    UNSAFE_componentWillMount() {
      this.managedLists.forEach(listKey => {
        if (!this.state[listKey].config.snapshotState) return null;
        const snapshot = this.props.snapshots[this.snapshotKey(listKey)];
        if (!snapshot || !snapshot.filters) return null;
        this.setValues(listKey, snapshot.filters);
      });
    }

    onReset = key => {
      this.setValues(key, this.initialValues(key), true);
    };

    get managedLists() {
      return Object.keys(filteredLists);
    }

    get initialState() {
      const state = {};
      this.managedLists.forEach(listKey => {
        const listDefinition = filteredLists[listKey];
        const listState = {};
        listState.config = listDefinition.config;
        listState.values = {};
        listState.params = [];
        listDefinition.params.forEach(paramDefinition => {
          const param = {
            label: paramDefinition.label,
            name: paramDefinition.name,
            as: paramDefinition.as,
            hidden: paramDefinition.hidden || false
          };
          if (paramDefinition.options) {
            param.options = paramDefinition.options.map(o => ({ ...o }));
          }
          listState.params.push(param);
          listState.values[param.name] = paramDefinition.value || "";
        });
        listState.initialValues = { ...listState.values };
        state[listKey] = listState;
      });
      return state;
    }

    get resetMessage() {
      return "Search and filters reset.";
    }

    setParam = (key, paramLike, value) => {
      const param = this.ensureParamObject(key, paramLike);
      this.setValues(key, { [param.as || param.name]: value });
    };

    setValues(key, updatedValues, isReset) {
      const listState = this.listState(key);
      const values = listState.values;
      const newValues = { ...values, ...updatedValues };
      const newListState = { ...listState, values: newValues };
      this.setState({
        [key]: newListState,
        message: isReset ? this.resetMessage : null
      });

      // remove message on timeout was a reset
      if (isReset) {
        setTimeout(() => {
          this.setState({ message: null });
        }, 1000);
      }
    }

    initialValues(key) {
      return this.state[key].initialValues;
    }

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

    buildMemoizedHandler = (name, key) => {
      const handler = this[name];
      return (...args) => {
        return handler(key, ...args);
      };
    };

    entitiesListSearchProps = key => {
      return {
        onReset: this.buildMemoizedHandler("onReset", key),
        setParam: this.buildMemoizedHandler("setParam", key),
        params: this.paramsFor(key),
        values: this.valuesFor(key)
      };
    };

    paramsFor = key => {
      return this.state[key].params;
    };

    snapshotKey(key) {
      return `entities-list-search-${key}`;
    }

    saveSearchState = (key, pagination) => {
      if (!this.state[key].config.snapshotState) return;
      const action = uiStateSnapshotActions.takeSnapshot(
        this.snapshotKey(key),
        {
          filters: this.requestParams(key),
          pagination
        }
      );
      this.props.dispatch(action);
    };

    savedSearchPaginationState = key => {
      if (!this.state[key].config.snapshotState) return null;
      const snapshot = this.props.snapshots[this.snapshotKey(key)];
      if (!snapshot) return null;
      return snapshot.pagination;
    };

    renderLiveRegion() {
      return (
        <div
          role="status"
          aria-live="polite"
          aria-atomic
          className="screen-reader-text"
        >
          {this.state.message}
        </div>
      );
    }

    render() {
      return (
        <>
          {this.renderLiveRegion()}
          <WrappedComponent
            {...this.props}
            entitiesListSearchProps={this.entitiesListSearchProps}
            entitiesListSearchParams={this.entitiesListSearchParams(this.state)}
            saveSearchState={this.saveSearchState}
            savedSearchPaginationState={this.savedSearchPaginationState}
          />
        </>
      );
    }
  }

  const connectedWithFilters = connect(WithFilters.mapStateToProps)(
    WithFilters
  );

  return hoistStatics(connectedWithFilters, WrappedComponent);
}

export default withFilters;
