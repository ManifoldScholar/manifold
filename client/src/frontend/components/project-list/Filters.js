import React, { Component } from "react";
import PropTypes from "prop-types";
import omitBy from "lodash/omitBy";
import isEmpty from "lodash/isEmpty";
import { ListFilters } from "global/components/list";

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

  get subjectOptions() {
    if (!this.props.subjects?.length) return [];
    return this.props.subjects.map(subject => {
      return {
        label: subject.attributes.name,
        value: subject.id
      };
    });
  }

  get featuredOptions() {
    if (this.props.hideFeatured) return null;
    return { label: "Featured Projects", value: "featured" };
  }

  get sortFilter() {
    return {
      label: "Sort results",
      value: this.state.filters.order || "",
      onChange: event => this.setFilters(event, "order"),
      options: [
        {
          label: "Sort",
          value: ""
        },
        {
          label: "A–Z",
          value: "sort_title ASC"
        },
        {
          label: "Z–A",
          value: "sort_title DESC"
        }
      ]
    };
  }

  get featuredAndSubjectFilter() {
    const options = [this.featuredOptions, ...this.subjectOptions];

    if (options.length < 1) return null;

    return {
      label: "Filter results",
      value: this.filterValue(),
      onChange: this.setFilters,
      options: [{ label: "Show all", value: "" }, ...options.filter(Boolean)]
    };
  }

  get filters() {
    const filters = [this.sortFilter, this.featuredAndSubjectFilter];
    return filters.filter(Boolean);
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

  resetFilters = () => {
    const newState = this.props.resetFilterState
      ? { filters: { ...this.props.resetFilterState } }
      : this.initialState();
    this.setState(newState, this.updateResults);
  };

  updateResults = event => {
    if (event) event.preventDefault();
    const filter = omitBy(this.state.filters, value => value === "");
    this.props.filterChangeHandler(filter);
  };

  filterValue() {
    const { featured, subject } = this.state.filters;
    if (featured === true || featured === "true") return "featured";
    if (subject) return subject;
    return "";
  }

  render() {
    return (
      <ListFilters
        searchProps={this.searchProps}
        filters={this.filters}
        onSubmit={this.updateResults}
        onReset={this.resetFilters}
        showResetButton={this.showResetButton}
        className="entity-section-wrapper__tools"
      />
    );
  }
}

export default ProjectListFilters;
