import React, { Component } from "react";
import PropTypes from "prop-types";
import capitalize from "lodash/capitalize";
import omitBy from "lodash/omitBy";
import isEmpty from "lodash/isEmpty";
import { ListFilters } from "global/components/list";

export class ResourceListFilters extends Component {
  static displayName = "ResourceList.Filters";

  static propTypes = {
    kinds: PropTypes.array,
    tags: PropTypes.array,
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

  get kindOptions() {
    if (!this.props.kinds?.length) return [];
    return this.props.kinds.map(kind => {
      return {
        label: capitalize(kind),
        value: kind
      };
    });
  }

  get tagOptions() {
    if (!this.props.tags?.length) return [];
    return this.props.tags.map(tag => {
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
    event.preventDefault();
    this.setState(this.initialState(), this.updateResults);
  };

  render() {
    return (
      <ListFilters
        searchProps={this.searchProps}
        filters={this.filters}
        onSubmit={this.updateResults}
        onReset={this.resetFilters}
        showResetButton={this.showResetButton}
        className="entity-section-wrapper__tools entity-section-wrapper__tools--wide"
      />
    );
  }
}

export default ResourceListFilters;
