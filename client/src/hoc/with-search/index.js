import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { entityStoreActions, uiSearchActions } from "actions";
import { searchResultsAPI, requests } from "api";
import { select, meta } from "utils/entityUtils";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import get from "lodash/get";

const { request, flush } = entityStoreActions;

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

function withSearch(WrappedComponent) {
  const displayName = `HigherOrder.WithSearchWrapper('${getDisplayName(
    WrappedComponent
  )})`;

  class WithSearch extends PureComponent {
    static WrappedComponent = WrappedComponent;

    static displayName = displayName;

    static mapStateToProps = state => {
      return {
        results: select(requests.rSearchResults, state.entityStore),
        resultsMeta: meta(requests.rSearchResults, state.entityStore),
        searchQueryState: get(state.ui, "transitory.search")
      };
    };

    static propTypes = {
      dispatch: PropTypes.func.isRequired,
      history: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      searchQueryState: PropTypes.object.isRequired
    };

    constructor(props) {
      super(props);
      this.searchComponent = React.createRef();
    }

    // If the search container mounts with searchQueryState params, it's being opened because
    // a search has been made already.  Immediately update the store, which will cause a search request.
    componentDidMount() {
      const locationSearchStateQuery = get(
        this.props.location,
        "state.searchQueryState"
      );
      if (locationSearchStateQuery)
        return this.setQueryState(locationSearchStateQuery);
    }

    componentDidUpdate(prevProps, prevStateIgnored) {
      // If the search query changes in the store, we know that new params were entered
      // and we have to make a new search request.
      if (prevProps.searchQueryState !== this.props.searchQueryState) {
        return this.doSearch();
      }

      // If we get a new searchQueryState as location state, we update the search query in the store.
      // This comes back as our searchQueryState prop, which will kick off a new search if changed.
      // The location state is reset after a search is performed (see doSearch promise success callback)
      // to ensure the location state has actually been changed.
      const locationSearchStateQuery = get(
        this.props.location,
        "state.searchQueryState"
      );
      const prevLocationSearchStateQuery = get(
        prevProps.location,
        "state.searchQueryState"
      );
      if (!locationSearchStateQuery) return null;

      if (prevLocationSearchStateQuery !== locationSearchStateQuery) {
        return this.setQueryState(locationSearchStateQuery);
      }
    }

    componentWillUnmount() {
      this.props.dispatch(flush(requests.rSearchResults));
      this.props.dispatch(uiSearchActions.resetSearch());
    }

    get childProps() {
      return {
        setQueryState: this.setQueryState,
        setPage: this.setPage,
        searchStateQuery: this.props.searchQueryState,
        history: this.props.history,
        location: this.props.location,
        ref: this.searchComponent
      };
    }

    setQueryState = queryParams => {
      return this.props.dispatch(uiSearchActions.setSearchQuery(queryParams));
    };

    setPage = page => {
      return event => {
        event.preventDefault();
        this.doSearch(page);
      };
    };

    doSearch(page = 1) {
      const pagination = { number: page };
      const query = { ...this.props.searchQueryState };
      query.page = pagination;
      const call = searchResultsAPI.index(query);
      const { promise: one } = this.props.dispatch(
        request(call, requests.rSearchResults)
      );
      one.then(
        () => {
          // Empty our location.state, so we can tell when a new search was made outside of this container.
          this.props.history.replace({ state: { searchQueryState: null } });
        },
        () => {
          // do nothing
        }
      );
    }

    render() {
      return React.createElement(WrappedComponent, {
        ...this.props,
        ...this.childProps
      });
    }
  }

  const SearchWithRouter = withRouter(WithSearch);
  return connect(SearchWithRouter.mapStateToProps)(SearchWithRouter);
}

export default withSearch;
