import React, { Component } from "react";
import PropTypes from "prop-types";
import omitBy from "lodash/omitBy";
import isEmpty from "lodash/isEmpty";
import { ListFilters } from "global/components/list";

export class ProjectCollectionFilters extends Component {
  static displayName = "ProjectCollection.Filters";

  static propTypes = {
    filterChangeHandler: PropTypes.func.isRequired,
    initialFilterState: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(props.initialFilterState);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.initialFilterState !== prevState.filters) {
      return { ...nextProps.initialFilterState };
    }

    return null;
  }

  get showResetButton() {
    const filterValues = Object.values(this.state.filters);
    const appliedFilters = filterValues.filter(Boolean);
    return !isEmpty(appliedFilters);
  }

  get searchProps() {
    return {
      value: this.state.filters.keyword || "",
      onChange: event => this.setFilters(event, "keyword")
    };
  }

  setFilters = (event, label) => {
    event.preventDefault();
    const value = event.target.value;
    const filters = { ...this.state.filters };
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
    const filters = { ...init };
    return { filters };
  }

  resetFilters = () => {
    event.preventDefault();
    this.setState(this.initialState(), this.updateResults);
  };

  render() {
    return (
      <ListFilters
        searchProps={this.searchProps}
        filters={[]}
        onSubmit={this.updateResults}
        onReset={this.resetFilters}
        showResetButton={this.showResetButton}
        className="entity-section-wrapper__tools"
      />
    );
  }
}

export default ProjectCollectionFilters;
