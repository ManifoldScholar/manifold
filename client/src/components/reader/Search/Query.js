import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class SearchQuery extends PureComponent {
  static displayName = "Search.Query";

  static propTypes = {
    showScopeFilter: PropTypes.bool.isRequired,
    includeSection: PropTypes.bool.isRequired,
    showFacetFilter: PropTypes.bool.isRequired,
    doSearch: PropTypes.func.isRequired,
    initialState: PropTypes.object,
    setQueryState: PropTypes.func
  };

  /* eslint-disable no-console */
  static defaultProps = {
    showScopeFilter: true,
    showFacetFilter: false,
    includeSection: false,
    doSearch: state => {
      console.warn("The SearchQuery component expects an doSearch callback.");
      console.warn("Current SearchQuery State");
      console.warn(state);
    }
  };
  /* eslint-enable no-console */

  constructor(props) {
    super(props);

    this.handlers = {};
    if (props.initialState) {
      this.state = Object.assign({}, props.initialState);
    } else {
      this.state = {
        keyword: "",
        scope: "text",
        facets: ["All"]
      };
    }
  }

  componentDidUpdate() {
    this.announceState();
  }

  setScope(value) {
    this.setState({ scope: value });
  }

  setKeyword = event => {
    const target = event.target;
    const value = target.value;
    this.setState({ keyword: value });
  };

  announceState() {
    this.props.setQueryState(this.state);
  }

  existsInState(type, key) {
    const was = this.state[type];
    return was.includes(key);
  }

  add(type, key) {
    if (key === "All") return this.setState({ [type]: ["All"] });
    const was = this.state[type];
    const is = this.existsInState(type, key) ? was : [...was, key];
    if (key !== "All") {
      const index = is.indexOf("All");
      if (index > -1) is.splice(index, 1);
    }
    this.setState({ [type]: is });
  }

  remove(type, key) {
    const was = this.state[type];
    const index = was.indexOf(key);
    if (index === -1) return;
    const is = was.slice(0, index).concat(was.slice(index + 1));
    if (is.length === 0) is.push("All");
    this.setState({ [type]: is });
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
    this.props.doSearch();
  };

  render() {
    const { showScopeFilter, showFacetFilter } = this.props;

    return (
      <form className="search-query" onSubmit={this.doSearch}>
        <div className="input-magnify">
          <input
            type="text"
            autoFocus
            onChange={this.setKeyword}
            value={this.state.keyword}
            placeholder={"Search for..."}
          />
          <button className="manicon manicon-magnify" />
        </div>
        <div className="filters">
          {showScopeFilter ? (
            <div className="filter">
              <label className="group-label">{"Search within:"}</label>
              <div className="checkbox-group">
                {this.props.includeSection ? (
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={this.state.scope === "section"}
                      onChange={this.makeScopeHandler("section")}
                    />
                    {/* Fake control to allow for custom checkbox styles */}
                    <div className="control-indicator">
                      <i className="manicon manicon-check" />
                    </div>
                    {"Chapter"}
                  </label>
                ) : null}
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={this.state.scope === "text"}
                    onChange={this.makeScopeHandler("text")}
                  />
                  {/* Fake control to allow for custom checkbox styles */}
                  <div className="control-indicator">
                    <i className="manicon manicon-check" />
                  </div>
                  {"Text"}
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={this.state.scope === "project"}
                    onChange={this.makeScopeHandler("project")}
                  />
                  {/* Fake control to allow for custom checkbox styles */}
                  <div className="control-indicator">
                    <i className="manicon manicon-check" />
                  </div>
                  {"Project"}
                </label>
              </div>
            </div>
          ) : null}

          {showFacetFilter ? (
            <div className="filter">
              <label className="group-label">{"Show Results For:"}</label>
              <div className="checkbox-group">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={this.existsInState("facets", "All")}
                    onChange={this.makeFacetHandler("facets", "All")}
                  />
                  {/* Fake control to allow for custom checkbox styles */}
                  <div className="control-indicator">
                    <i className="manicon manicon-check" />
                  </div>
                  {"Everything"}
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={this.existsInState("facets", "SearchableNode")}
                    onChange={this.makeFacetHandler("facets", "SearchableNode")}
                  />
                  {/* Fake control to allow for custom checkbox styles */}
                  <div className="control-indicator">
                    <i className="manicon manicon-check" />
                  </div>
                  {"Texts"}
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={this.existsInState("facets", "Annotation")}
                    onChange={this.makeFacetHandler("facets", "Annotation")}
                  />
                  {/* Fake control to allow for custom checkbox styles */}
                  <div className="control-indicator">
                    <i className="manicon manicon-check" />
                  </div>
                  {"Annotations"}
                </label>
              </div>
            </div>
          ) : null}
        </div>
      </form>
    );
  }
}
