import React, { Component } from "react";
import PropTypes from "prop-types";
import omitBy from "lodash/omitBy";
import { UID } from "react-uid";
import isEmpty from "lodash/isEmpty";
import Utility from "global/components/utility";

import withScreenReaderStatus from "hoc/with-screen-reader-status";

export class ProjectListFilters extends Component {
  static displayName = "ProjectList.Filters";

  static propTypes = {
    filterChangeHandler: PropTypes.func,
    initialFilterState: PropTypes.object,
    resetFilterState: PropTypes.object,
    subjects: PropTypes.array,
    hideFeatured: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(props.initialFilterState);
    this.searchInput = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.initialFilterState !== prevState.filters) {
      return { ...nextProps.initialFilterState };
    }

    return null;
  }

  get showResetButton() {
    return !isEmpty(this.state.filters);
  }

  get resetMessage() {
    return "Search and filters reset.";
  }

  get idPrefix() {
    return "project-filter";
  }

  setFilters = (event, label) => {
    event.preventDefault();
    const value = event.target.value;
    let filters = { ...this.state.filters };
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
    const filters = { ...init };
    return { filters };
  }

  resetFilters = event => {
    event.preventDefault();
    const newState = this.props.resetFilterState
      ? { filters: { ...this.props.resetFilterState } }
      : this.initialState();
    this.setState(newState, this.updateResults);
    // update SR message
    this.props.setScreenReaderStatus(this.resetMessage);
    // focus on search field
    this.searchInput.current.focus();
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
          <Utility.IconComposer
            className="search-icon"
            icon="search16"
            size={20}
          />
        </button>
        <UID name={id => `${this.idPrefix}-${id}`}>
          {id => (
            <>
              <label htmlFor={id} className="screen-reader-text">
                Enter Search Criteria
              </label>
              <input
                ref={this.searchInput}
                value={this.state.filters.keyword || ""}
                type="text"
                id={id}
                onChange={event => this.setFilters(event, "keyword")}
                placeholder="Search…"
              />
            </>
          )}
        </UID>
      </div>
    );
  }

  renderSort() {
    return (
      <UID name={id => `${this.idPrefix}-${id}`}>
        {id => (
          <>
            <div className="select">
              <label htmlFor={id} className="screen-reader-text">
                Sort results
              </label>
              <select
                id={id}
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
          </>
        )}
      </UID>
    );
  }

  renderFilters() {
    if (!this.featuredOptions() && !this.subjectOptions()) return null;

    return (
      <UID name={id => `${this.idPrefix}-${id}`}>
        {id => (
          <>
            <div className="select">
              <label htmlFor={id} className="screen-reader-text">
                Filter results
              </label>
              <select
                id={id}
                value={this.filterValue()}
                onChange={this.setFilters}
              >
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
          </>
        )}
      </UID>
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
        {this.showResetButton && (
          <button className="reset-button" onClick={this.resetFilters}>
            {"Reset Search + Filters"}
          </button>
        )}
      </form>
    );
  }
}

export default withScreenReaderStatus(ProjectListFilters);
