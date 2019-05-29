import React, { Component } from "react";
import PropTypes from "prop-types";
import omitBy from "lodash/omitBy";
import { UID } from "react-uid";
import isEmpty from "lodash/isEmpty";
import Utility from "global/components/utility";

import withScreenReaderStatus from "hoc/with-screen-reader-status";

export class ProjectCollectionFilters extends Component {
  static displayName = "ProjectCollection.Filters";

  static propTypes = {
    filterChangeHandler: PropTypes.func.isRequired,
    initialFilterState: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(props.initialFilterState);
    this.searchInput = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.initialFilterState !== prevState.filters) {
      return Object.assign({}, nextProps.initialFilterState);
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
    return "filters-search";
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
    // update SR message
    this.props.setScreenReaderStatus(this.resetMessage);
    // focus on search field
    this.searchInput.current.focus();
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
          <UID name={id => `${this.idPrefix}-${id}`}>
            {id => (
              <React.Fragment>
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
              </React.Fragment>
            )}
          </UID>
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
        {this.showResetButton && (
          <button className="reset-button" onClick={this.resetFilters}>
            {"Reset Search + Filters"}
          </button>
        )}
      </form>
    );
  }
}

export default withScreenReaderStatus(ProjectCollectionFilters);
