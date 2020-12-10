import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { UIDConsumer } from "react-uid";
import classNames from "classnames";
import Utility from "global/components/utility";
import Option from "global/components/form/Radio/Option";
import CheckboxMixed from "./CheckboxMixed";

export default class SearchQueryForm extends PureComponent {
  static displayName = "Search.Query.Form";

  static propTypes = {
    initialState: PropTypes.object,
    searchQueryState: PropTypes.object,
    setQueryState: PropTypes.func.isRequired,
    facets: PropTypes.array,
    scopes: PropTypes.array,
    description: PropTypes.string,
    searchType: PropTypes.string,
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
    }
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
      if (availableScopes.find(s => s.value === "project")) {
        state.scope = "project";
      } else if (availableScopes.find(s => s.value === "text")) {
        state.scope = "text";
      } else {
        state.scope = availableScopes[availableScopes.length - 1];
      }
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
    return { ...state, ...newState };
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

  setFacets(facets) {
    facets.sort();
    return this.setState({ facets }, this.doSearch);
  }

  get availableScopes() {
    const scopes = [];
    const { projectId, textId, sectionId } = this.props;
    if (sectionId)
      scopes.push({
        label: "Chapter",
        value: "section",
        originalValue: "section"
      });
    if (textId)
      scopes.push({ label: "Text", value: "text", originalValue: "text" });
    if (projectId)
      scopes.push({
        label: "Project",
        value: "project",
        originalValue: "project"
      });
    return scopes;
  }

  get availableFacetValues() {
    return this.props.facets.map(f => f.value).sort();
  }

  get searchIdPrefix() {
    return "query-search";
  }

  get checkboxClasses() {
    return "search-query__checkbox checkbox checkbox--white";
  }

  get typeIsReader() {
    return this.props.searchType === "reader";
  }

  internalStateFromIncomingState(initialState) {
    let newState = {
      facets: [],
      scope: null,
      keyword: "",
      ...initialState
    };
    newState = this.setDefaultScope(newState);
    newState = this.setScopeIdFromScopeString(newState);
    return newState;
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

  doSearch = (event = null) => {
    if (event) event.preventDefault();
    if (!this.state.keyword) return null; // If there's no keyword, don't do anything yet.
    this.props.setQueryState(this.state);
  };

  renderScopeOptions() {
    return (
      <fieldset
        className={classNames({
          "search-query__filter-group": true,
          "search-query__filter-group--inline": this.typeIsReader
        })}
      >
        <div className="search-query__group-label">
          <legend>Search within:</legend>
        </div>
        <div className="search-query__filter-group-list">
          {this.availableScopes.map(option => (
            <Option
              key={option.value}
              option={option}
              groupName={`search[scope]`}
              onChange={this.makeScopeHandler(option.value)}
              value={this.state.scope}
              inline
            />
          ))}
        </div>
      </fieldset>
    );
  }

  renderFacetOptions() {
    return (
      <CheckboxMixed
        label="Show results for:"
        checkboxes={this.props.facets}
        onChange={value => this.setFacets(value)}
      />
    );
  }

  renderFooter() {
    if (this.props.searchType !== "frontend" && !this.props.description)
      return false;

    return (
      <div className="search-query__footer">
        {this.props.description ? (
          <div className="search-query__description">
            {this.props.description}
          </div>
        ) : null}
        {this.props.searchType === "frontend" ? (
          <button
            type="submit"
            className="search-query__button-primary button-primary"
          >
            <span className="button-primary__text">Search</span>
          </button>
        ) : null}
      </div>
    );
  }

  render() {
    return (
      <form className="search-query" onSubmit={this.doSearch}>
        <div className="search-query__input-magnify">
          <UIDConsumer name={id => `${this.searchIdPrefix}-${id}`}>
            {id => (
              <>
                <label htmlFor={id} className="screen-reader-text">
                  Enter Search Criteria
                </label>
                <input
                  type="text"
                  id={id}
                  autoFocus
                  onChange={this.setKeyword}
                  value={this.state.keyword}
                  placeholder={"Search…"}
                  className="search-query__input"
                />
              </>
            )}
          </UIDConsumer>
          <button type="submit" className="search-query__submit">
            <Utility.IconComposer
              iconClass="search-query__search-icon"
              icon="search16"
              size={22}
            />
            <span className="screen-reader-text">Execute Search</span>
          </button>
        </div>
        {this.availableScopes.length > 1 && this.renderScopeOptions()}
        {this.props.facets.length > 0 && this.renderFacetOptions()}
        {this.renderFooter()}
      </form>
    );
  }
}
