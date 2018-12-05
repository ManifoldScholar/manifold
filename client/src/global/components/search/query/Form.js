import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import labelId from "helpers/labelId";

export default class SearchQuery extends PureComponent {
  static displayName = "Search.Query";

  static propTypes = {
    initialState: PropTypes.object,
    setQueryState: PropTypes.func.isRequired,
    facets: PropTypes.array,
    scopes: PropTypes.array,
    description: PropTypes.string,
    searchType: PropTypes.string,
    searchId: PropTypes.string
  };

  /* eslint-disable no-console */
  static defaultProps = {
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

    this.handlers = {};
    this.state = Object.assign({}, props.initialState);
  }

  componentDidUpdate(prevProps, prevStateIgnored) {
    if (prevProps.initialState !== this.props.initialState) {
      return this.setState(this.props.initialState);
    }
  }

  setScope(value) {
    this.setState({ scope: value }, this.doSearch);
  }

  setKeyword = event => {
    const target = event.target;
    const value = target.value;
    this.setState({ keyword: value });
  };

  setFacet(type, value) {
    return this.setState({ [type]: value }, this.doSearch);
  }

  existsInState(type, key) {
    const was = this.state[type];
    return was.includes(key);
  }

  add(type, key) {
    if (key === "All") return this.setFacet(type, ["All"]);
    const was = this.state[type];
    const is = this.existsInState(type, key) ? was : [...was, key];
    if (key !== "All") {
      const index = is.indexOf("All");
      if (index > -1) is.splice(index, 1);
    }
    return this.setFacet(type, is);
  }

  remove(type, key) {
    const was = this.state[type];
    const index = was.indexOf(key);
    if (index === -1) return;
    const is = was.slice(0, index).concat(was.slice(index + 1));
    if (is.length === 0) is.push("All");
    return this.setFacet(type, is);
  }

  makeScopeHandler(value) {
    if (!this.handlers.scope) this.handlers.scope = {};
    let handler = this.handlers.scope[value];
    if (handler) return handler;
    handler = () => {
      this.setScope(value);
    };
    this.handlers.scope[value] = handler;
    return handler;
  }

  makeFacetHandler(type, key) {
    if (!this.handlers[type]) this.handlers[type] = {};
    let handler = this.handlers[type][key];
    if (handler) return handler;
    handler = event => {
      const target = event.target;
      const value = target.type === "checkbox" ? target.checked : target.value;
      value ? this.add(type, key) : this.remove(type, key);
    };
    this.handlers[type][key] = handler;
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
        {this.props.scopes.length > 0 ? (
          <div className="filters">
            {this.props.searchType !== "reader" ? (
              <h4 className="group-label">{"Search within:"}</h4>
            ) : null}
            <div className="checkbox-group">
              {this.props.searchType === "reader" ? (
                <h4 className="group-label">{"Search within:"}</h4>
              ) : null}
              {this.props.scopes.map((scope, index) => {
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
                  checked={this.existsInState("facets", "All")}
                  onChange={this.makeFacetHandler("facets", "All")}
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
                      checked={this.existsInState("facets", facet.value)}
                      onChange={this.makeFacetHandler("facets", facet.value)}
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
