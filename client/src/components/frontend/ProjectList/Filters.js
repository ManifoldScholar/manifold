import React, { Component } from "react";
import PropTypes from "prop-types";
import omitBy from "lodash/omitBy";
import uniqueId from "lodash/uniqueId";

export default class ProjectListFilters extends Component {
  static displayName = "ProjectList.Filters";

  static propTypes = {
    filterChangeHandler: PropTypes.func,
    initialFilterState: PropTypes.object,
    subjects: PropTypes.array,
    hideFeatured: PropTypes.bool,
    searchId: PropTypes.string
  };

  static defaultProps = {
    searchId: uniqueId("filters-search-")
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(props.initialFilterState);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.initialFilterState !== prevState.filters) {
      return Object.assign({}, nextProps.initialFilterState);
    }

    return null;
  }

  setFilters = (event, label) => {
    event.preventDefault();
    const value = event.target.value;
    let filters = Object.assign({}, this.state.filters);
    filters[label] = value;
    if (label === "keyword") return this.setState({ filters });
    if (label === "order") {
      return this.setState({ filters }, this.updateResults);
    }
    switch (value) {
      case "featured":
        filters = { featured: true };
        break;
      default:
        filters = { subject: value };
        break;
    }
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

  subjectOptions() {
    if (!this.props.subjects || this.props.subjects.length === 0) return null;
    return this.props.subjects.map(subject => {
      return (
        <option key={subject.id} value={subject.id}>
          {subject.attributes.name}
        </option>
      );
    });
  }

  featuredOptions() {
    if (this.props.hideFeatured) return null;
    return <option value="featured">Featured Projects</option>;
  }

  filterValue() {
    const { featured, subject } = this.state.filters;
    if (featured === true || featured === "true") return "featured";
    if (subject) return subject;
    return "";
  }

  renderSearch() {
    return (
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
    );
  }

  renderSort() {
    return (
      <div className="select">
        <select
          onChange={event => this.setFilters(event, "order")}
          value={this.state.filters.order || ""}
        >
          <option value="">Sort</option>
          <option value="sort_title ASC">A-Z</option>
          <option value="sort_title DESC">Z-A</option>
        </select>
        <i className="manicon manicon-caret-down" aria-hidden="true" />
      </div>
    );
  }

  renderFilters() {
    if (!this.featuredOptions() && !this.subjectOptions()) return null;

    return (
      <div className="select">
        <select value={this.filterValue()} onChange={this.setFilters}>
          <option value="">Show All</option>
          {this.featuredOptions()}
          {this.subjectOptions()}
        </select>
        <i className="manicon manicon-caret-down" aria-hidden="true" />
      </div>
    );
  }

  render() {
    return (
      <form className="form-list-filter" onSubmit={this.updateResults}>
        {this.renderSearch()}
        <div className="select-group inline">
          {this.renderSort()}
          {this.renderFilters()}
        </div>
        <button className="reset-button" onClick={this.resetFilters}>
          {"Reset Search + Filters"}
        </button>
      </form>
    );
  }
}
