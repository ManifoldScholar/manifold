import React, { Component } from "react";
import PropTypes from "prop-types";
import omitBy from "lodash/omitBy";
import uniqueId from "lodash/uniqueId";

export default class ProjectCollectionFilters extends Component {
  static displayName = "ProjectCollection.Filters";

  static propTypes = {
    filterChangeHandler: PropTypes.func.isRequired,
    initialFilterState: PropTypes.object,
    searchId: PropTypes.string
  };

  static defaultProps = {
    searchId: uniqueId("filters-search-")
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.initialFilterState !== prevState.filters) {
      return Object.assign({}, nextProps.initialFilterState);
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = this.initialState(props.initialFilterState);
  }

  setFilters = (event, label) => {
    event.preventDefault();
    const value = event.target.value;
    const filters = Object.assign({}, this.state.filters);
    filters[label] = value;
    if (label === "keyword") return this.setState({ filters });
    this.setState({ filters }, this.updateResults);
  };

  updateResults = event => {
    if (event) event.preventDefault();
    const filter = omitBy(this.state.filters, value => value === "");
    this.props.filterChangeHandler(filter);
  };

  initialState(init) {
    const filters = Object.assign({}, init);
    return { filters };
  }

  resetFilters = event => {
    event.preventDefault();
    this.setState(this.initialState(), this.updateResults);
  };

  render() {
    return (
      <form className="form-list-filter" onSubmit={this.updateResults}>
        <div className="search-input">
          <button className="search-button" type="submit">
            <span className="screen-reader-text">Search…</span>
            <i className="manicon manicon-magnify" aria-hidden="true" />
          </button>
          <label htmlFor={this.props.searchId} className="screen-reader-text">
            Enter Search Criteria
          </label>
          <input
            value={this.state.filters.keyword || ""}
            type="text"
            id={this.props.searchId}
            onChange={event => this.setFilters(event, "keyword")}
            placeholder="Search…"
          />
        </div>
        <div className="select-group inline">
          <div className="select">
            <select
              onChange={event => this.setFilters(event, "order")}
              value={this.state.filters.order || ""}
            >
              <option value="default">Sort</option>
              <option value="sort_title ASC">A-Z</option>
              <option value="sort_title DESC">Z-A</option>
            </select>
            <i className="manicon manicon-caret-down" aria-hidden="true" />
          </div>
        </div>
        <button className="reset-button" onClick={this.resetFilters}>
          {"Reset Search + Filters"}
        </button>
      </form>
    );
  }
}
