import React, { Component } from "react";
import PropTypes from "prop-types";
import capitalize from "lodash/capitalize";
import omitBy from "lodash/omitBy";
import labelId from "helpers/labelId";
import Utility from "global/components/utility";

export default class ResourceListFilters extends Component {
  static defaultProps = {
    searchId: labelId("filters-search-")
  };

  static displayName = "ResourceList.Filters";

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.initialFilterState !== prevState.filters) {
      return Object.assign({}, nextProps.initialFilterState);
    }

    return null;
  }

  static propTypes = {
    kinds: PropTypes.array,
    tags: PropTypes.array,
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
      <form className="form-list-filter" onSubmit={this.updateResults}>
        <div className="search-input">
          <button className="search-button" type="submit">
            <span className="screen-reader-text">Search</span>
            <Utility.IconComposer
              className="search-icon"
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
            placeholder="Search"
          />
        </div>
        <div className="select-group inline">
          <div className="select">
            <select
              onChange={event => this.setFilters(event, "kind")}
              value={this.state.filters.kind || ""}
            >
              <option value="">Type:</option>
              {this.props.kinds
                ? this.props.kinds.map(kind => {
                    return (
                      <option key={kind} value={kind}>
                        {capitalize(kind)}
                      </option>
                    );
                  })
                : null}
            </select>
            <i className="manicon manicon-caret-down" aria-hidden="true" />
          </div>
          <div className="select">
            <select
              onChange={event => this.setFilters(event, "tag")}
              value={this.state.filters.tag || ""}
            >
              <option value="">Tag:</option>
              {this.props.tags
                ? this.props.tags.map(tag => {
                    return (
                      <option key={tag} value={tag}>
                        {capitalize(tag)}
                      </option>
                    );
                  })
                : null}
            </select>
            <i className="manicon manicon-caret-down" aria-hidden="true" />
          </div>
          <div className="select">
            <select
              onChange={event => this.setFilters(event, "order")}
              value={this.state.filters.order || ""}
            >
              <option value="default">Sort By:</option>
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
