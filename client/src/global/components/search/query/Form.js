import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import labelId from "helpers/labelId";
import isEqual from "lodash/isEqual";

export default class SearchQuery extends PureComponent {
  static displayName = "Search.Query";

  static propTypes = {
    initialState: PropTypes.object,
    searchQueryState: PropTypes.object,
    setQueryState: PropTypes.func.isRequired,
    facets: PropTypes.array,
    scopes: PropTypes.array,
    description: PropTypes.string,
    searchType: PropTypes.string,
    searchId: PropTypes.string,
    searchOnScopeChange: PropTypes.bool,
    projectId: PropTypes.string,
    textId: PropTypes.string,
    sectionId: PropTypes.string
  };

  /* eslint-disable no-console */
  static defaultProps = {
    searchOnScopeChange: true,
    facets: [],
    scopes: [],
    setQueryState: state => {
      console.warn(
        "The SearchQuery component expects a setQueryState callback."
      );
      console.warn("Current SearchQuery State");
      console.warn(state);
    },
    searchId: labelId("query-search-")
  };
  /* eslint-enable no-console */

  constructor(props) {
    super(props);

    this.handlers = {
      facets: {},
      scopes: {}
    };

    this.state = this.internalStateFromIncomingState(props.initialState);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.searchQueryState &&
      prevProps.searchQueryState !== this.props.searchQueryState
    ) {
      this.setState(
        this.internalStateFromIncomingState(this.props.searchQueryState)
      );
    }
  }

  /* eslint-disable no-param-reassign */
  setDefaultScope(state) {
    const availableScopes = this.availableScopes;
    if (availableScopes.length > 0 && !state.scope) {
      if (availableScopes.find(s => s.value === "text")) {
        state.scope = "text";
      } else {
        state.scope = availableScopes[availableScopes.length - 1];
      }
    }
    return state;
  }
  /* eslint-enable no-param-reassign */

  /* eslint-disable no-param-reassign */
  setFacetsFromAllFacets(state) {
    if (state.allFacets) {
      state.facets = this.availableFacetValues;
    }
    return state;
  }
  /* eslint-enable no-param-reassign */

  setScopeIdFromScopeString(state) {
    const { scope } = state;
    const newState = { scope, project: null, text: null, textSection: null };
    if (scope === "project") newState.project = this.props.projectId;
    if (scope === "text") newState.text = this.props.textId;
    if (scope === "section") newState.textSection = this.props.sectionId;
    return Object.assign({}, state, newState);
  }

  setScope(scope) {
    if (scope === this.state.scope) return;
    const callback = this.props.searchOnScopeChange ? this.doSearch : null;
    this.setState(this.setScopeIdFromScopeString({ scope }), callback);
  }

  setKeyword = event => {
    const target = event.target;
    const value = target.value;
    this.setState({ keyword: value });
  };

  setSelectedFacets(facets, allFacets = false) {
    facets.sort();
    const facetsUnchanged = isEqual(facets, this.state.facets);
    if (facetsUnchanged && allFacets === this.state.allFacets) return;
    const callback = facetsUnchanged ? null : this.doSearch;
    return this.setState({ facets, allFacets }, callback);
  }

  get availableScopes() {
    const scopes = [];
    const { projectId, textId, sectionId } = this.props;
    if (sectionId) scopes.push({ label: "Chapter", value: "section" });
    if (textId) scopes.push({ label: "Text", value: "text" });
    if (projectId) scopes.push({ label: "Project", value: "project" });
    return scopes;
  }

  get availableFacetValues() {
    return this.props.facets.map(f => f.value).sort();
  }

  get selectedFacets() {
    return this.state.facets;
  }

  get allFacetsSelected() {
    return isEqual(this.availableFacetValues, this.selectedFacets);
  }

  internalStateFromIncomingState(initialState) {
    let newState = Object.assign(
      { facets: [], scope: null, keyword: null },
      initialState
    );
    newState = this.setDefaultScope(newState);
    newState = this.setScopeIdFromScopeString(newState);
    newState = this.setFacetsFromAllFacets(newState);
    return newState;
  }

  facetChecked(value) {
    if (this.state.allFacets) {
      return value === "All";
    }
    return this.facetSelected(value);
  }

  facetSelected(value) {
    return this.selectedFacets.includes(value);
  }

  selectFacet(key) {
    if (this.allFacetsSelected) {
      return this.setSelectedFacets([key]);
    }
    const selected = this.state.facets;
    const updated = this.facetSelected(key) ? selected : [...selected, key];
    return this.setSelectedFacets(updated);
  }

  deselectFacet(key) {
    const selected = this.state.facets;
    let updated = selected;
    let allFacets = false;
    const index = selected.indexOf(key);
    if (index !== -1)
      updated = selected.slice(0, index).concat(selected.slice(index + 1));
    if (updated.length === 0) {
      updated = this.availableFacetValues;
      allFacets = true;
    }
    return this.setSelectedFacets(updated, allFacets);
  }

  valueFromEvent(event) {
    const { target } = event;
    return target.type === "checkbox" ? target.checked : target.value;
  }

  makeScopeHandler(value) {
    let handler = this.handlers.scopes[value];
    if (handler) return handler;
    handler = () => {
      this.setScope(value);
    };
    this.handlers.scopes[value] = handler;
    return handler;
  }

  makeFacetHandler(key) {
    let handler = this.handlers.facets[key];
    if (handler) return handler;
    handler = event => {
      if (key === "All") {
        this.setSelectedFacets(this.availableFacetValues, true);
      } else {
        this.valueFromEvent(event)
          ? this.selectFacet(key)
          : this.deselectFacet(key);
      }
    };
    this.handlers.facets[key] = handler;
    return handler;
  }

  doSearch = (event = null) => {
    if (event) event.preventDefault();
    if (!this.state.keyword) return null; // If there's no keyword, don't do anything yet.
    this.props.setQueryState(this.state);
  };

  renderFooter() {
    if (this.props.searchType !== "frontend" && !this.props.description)
      return false;

    return (
      <div className="footer">
        {this.props.description ? (
          <div className="description">{this.props.description}</div>
        ) : null}
        {this.props.searchType === "frontend" ? (
          <button type="submit" className="button-primary">
            {"Search"}
          </button>
        ) : null}
      </div>
    );
  }

  render() {
    return (
      <form className="search-query" onSubmit={this.doSearch}>
        <div className="input-magnify">
          <label htmlFor={this.props.searchId} className="screen-reader-text">
            Enter Search Criteria
          </label>
          <input
            type="text"
            id={this.props.searchId}
            autoFocus
            onChange={this.setKeyword}
            value={this.state.keyword}
            placeholder={"Search…"}
          />
          <button type="submit" className="manicon manicon-magnify">
            <span className="screen-reader-text">Search</span>
          </button>
        </div>
        {this.availableScopes.length > 0 ? (
          <div className="filters">
            {this.props.searchType !== "reader" ? (
              <h4 className="group-label">{"Search within:"}</h4>
            ) : null}
            <div className="checkbox-group">
              {this.props.searchType === "reader" ? (
                <h4 className="group-label">{"Search within:"}</h4>
              ) : null}
              {this.availableScopes.map((scope, index) => {
                const filterCheckboxId = scope.value + "-" + index;

                return (
                  <label
                    htmlFor={filterCheckboxId}
                    key={scope.value}
                    className="checkbox"
                  >
                    <input
                      type="checkbox"
                      id={filterCheckboxId}
                      checked={this.state.scope === scope.value}
                      onChange={this.makeScopeHandler(scope.value)}
                    />
                    <div className="control-indicator" aria-hidden="true">
                      <i className="manicon manicon-check" />
                    </div>
                    {scope.label}
                  </label>
                );
              })}
            </div>
          </div>
        ) : null}

        {this.props.facets.length > 0 ? (
          <div className="filters">
            <h4 className="group-label">{"Show Results For:"}</h4>
            <div className="checkbox-group">
              <label htmlFor="all-filters" key={"all"} className="checkbox">
                <input
                  type="checkbox"
                  id="all-filters"
                  checked={this.facetChecked("All")}
                  onChange={this.makeFacetHandler("All")}
                />
                {/* Fake control to allow for custom checkbox styles */}
                <div className="control-indicator" aria-hidden="true">
                  <i className="manicon manicon-check" />
                </div>
                {"Everything"}
              </label>
              {this.props.facets.map((facet, index) => {
                const facetCheckboxId = facet.value + "-" + index;

                return (
                  <label
                    htmlFor={facetCheckboxId}
                    key={facet.value}
                    className="checkbox"
                  >
                    <input
                      type="checkbox"
                      id={facetCheckboxId}
                      checked={this.facetChecked(facet.value)}
                      onChange={this.makeFacetHandler(facet.value)}
                    />
                    {/* Fake control to allow for custom checkbox styles */}
                    <div className="control-indicator" aria-hidden="true">
                      <i className="manicon manicon-check" />
                    </div>
                    {facet.label}
                  </label>
                );
              })}
            </div>
          </div>
        ) : null}

        {this.renderFooter()}
      </form>
    );
  }
}
