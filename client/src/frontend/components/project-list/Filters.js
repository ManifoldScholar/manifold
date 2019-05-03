import React, { Component } from "react";
import PropTypes from "prop-types";
import omitBy from "lodash/omitBy";
import uniqueId from "lodash/uniqueId";
import Utility from "global/components/utility";

export default class ProjectListFilters extends Component {
  static defaultProps = {
    searchId: uniqueId("filters-search-")
  };

  static displayName = "ProjectList.Filters";

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.initialFilterState !== prevState.filters) {
      return Object.assign({}, nextProps.initialFilterState);
    }

    return null;
  }

  static propTypes = {
    filterChangeHandler: PropTypes.func,
    initialFilterState: PropTypes.object,
    subjects: PropTypes.array,
    hideFeatured: PropTypes.bool,
    searchId: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(props.initialFilterState);
  }

  /* eslint-disable react/no-access-state-in-setstate */
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

  resetFilters = event => {
    event.preventDefault();
    this.setState(this.initialState(), this.updateResults);
  };

  updateResults = event => {
    if (event) event.preventDefault();
    const filter = omitBy(this.state.filters, value => value === "");
    this.props.filterChangeHandler(filter);
  };

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

  initialState(init) {
    const filters = Object.assign({}, init);
    return { filters };
  }

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

  renderFilters() {
    if (!this.featuredOptions() && !this.subjectOptions()) return null;

    return (
      <div className="select">
        <select value={this.filterValue()} onChange={this.setFilters}>
          <option value="">Show All</option>
          {this.featuredOptions()}
          {this.subjectOptions()}
        </select>
        <Utility.IconComposer
          icon="disclosureDown16"
          size={20}
          iconClass="select__icon"
        />
      </div>
    );
  }

  renderSearch() {
    return (
      <div className="search-input">
        <button className="search-button" type="submit">
          <span className="screen-reader-text">Search…</span>
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
        <Utility.IconComposer
          icon="disclosureDown16"
          size={20}
          iconClass="select__icon"
        />
      </div>
    );
  }

  render() {
    return (
      <form
        className="form-list-filter entity-section-wrapper__tools"
        onSubmit={this.updateResults}
      >
        {this.renderSearch()}
        <div className="select-group inline">
          {this.renderSort()}
          {this.renderFilters()}
        </div>
        <button
          className="reset-button"
          onClick={this.resetFilters}
          type="button"
        >
          {"Reset Search + Filters"}
        </button>
      </form>
    );
  }
}
