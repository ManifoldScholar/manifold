import React, { Component } from "react";
import PropTypes from "prop-types";
import omitBy from "lodash/omitBy";
import uniqueId from "lodash/uniqueId";
import Utility from "global/components/utility";

export default class ProjectCollectionFilters extends Component {
  static defaultProps = {
    searchId: uniqueId("filters-search-")
  };

  static displayName = "ProjectCollection.Filters";

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.initialFilterState !== prevState.filters) {
      return Object.assign({}, nextProps.initialFilterState);
    }

    return null;
  }

  static propTypes = {
    filterChangeHandler: PropTypes.func.isRequired,
    initialFilterState: PropTypes.object,
    searchId: PropTypes.string
  };

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

  initialState(init) {
    const filters = Object.assign({}, init);
    return { filters };
  }

  resetFilters = event => {
    event.preventDefault();
    this.setState(this.initialState(), this.updateResults);
  };

  updateResults = event => {
    if (event) event.preventDefault();
    const filter = omitBy(this.state.filters, value => value === "");
    this.props.filterChangeHandler(filter);
  };

  render() {
    return (
      <form
        className="entity-section-wrapper__tools form-list-filter"
        onSubmit={this.updateResults}
      >
        <div className="search-input">
          <button className="search-button" type="submit">
            <span className="screen-reader-text">Search…</span>
            <Utility.IconComposer
              iconClass="search-icon"
              icon="search16"
              size={20}
            />
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
              <option value="">Sort</option>
              <option value="sort_title ASC">A-Z</option>
              <option value="sort_title DESC">Z-A</option>
            </select>
            <Utility.IconComposer
              icon="disclosureDown16"
              size={20}
              iconClass="select__icon"
            />
          </div>
        </div>
        <button className="reset-button" onClick={this.resetFilters}>
          {"Reset Search + Filters"}
        </button>
      </form>
    );
  }
}
