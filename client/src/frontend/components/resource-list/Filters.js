import React, { Component } from "react";
import PropTypes from "prop-types";
import capitalize from "lodash/capitalize";
import omitBy from "lodash/omitBy";
import isEmpty from "lodash/isEmpty";
import { ListFilters } from "global/components/list";

export class ResourceListFilters extends Component {
  static displayName = "ResourceList.Filters";

  static propTypes = {
    filterChangeHandler: PropTypes.func.isRequired,
    initialFilterState: PropTypes.object,
    resetFilterState: PropTypes.object,
    project: PropTypes.object
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

  get project() {
    return this.props.project;
  }

  get kinds() {
    return this.project?.attributes.resourceKinds;
  }

  get tags() {
    return this.project?.attributes.resourceTags;
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

  get kindOptions() {
    if (!this.kinds?.length) return [];
    return this.kinds.map(kind => {
      return {
        label: capitalize(kind),
        value: kind
      };
    });
  }

  get tagOptions() {
    if (!this.tags?.length) return [];
    return this.tags.map(tag => {
      return {
        label: capitalize(tag),
        value: tag
      };
    });
  }

  get kindFilter() {
    return {
      label: "Kind",
      value: this.state.filters.kind || "",
      onChange: event => this.setFilters(event, "kind"),
      options: [{ label: "Type:", value: "" }, ...this.kindOptions]
    };
  }

  get tagFilter() {
    return {
      label: "Tag",
      value: this.state.filters.tag || "",
      onChange: event => this.setFilters(event, "tag"),
      options: [{ label: "Tag:", value: "" }, ...this.tagOptions]
    };
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

  get filters() {
    return [this.kindFilter, this.tagFilter, this.sortFilter];
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
    const newState = this.props.resetFilterState
      ? { filters: { ...this.props.resetFilterState } }
      : this.initialState();
    this.setState(newState, this.updateResults);
  };

  render() {
    return (
      <ListFilters
        searchProps={this.searchProps}
        filters={this.filters}
        onSubmit={this.updateResults}
        onReset={this.resetFilters}
        showResetButton={this.showResetButton}
      />
    );
  }
}

export default ResourceListFilters;
