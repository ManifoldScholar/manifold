import React from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import classNames from "classnames";
import Utility from "global/components/utility";
import { ListFilters } from "global/components/list";

export default class AnnotationNoteFilter extends React.PureComponent {
  static displayName = "Annotation.NoteFilter";

  static propTypes = {
    pagination: PropTypes.object.isRequired,
    filterChangeHandler: PropTypes.func.isRequired,
    initialFilterState: PropTypes.object,
    texts: PropTypes.array,
    sections: PropTypes.array,
    memberships: PropTypes.array,
    showSearch: PropTypes.bool
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

  initialState(init) {
    const filters = { ...init };
    return { filters };
  }

  get showResetButton() {
    if (!this.props.showSearch) return false;

    const filterValues = Object.values(this.state.filters);
    const appliedFilters = filterValues.filter(Boolean);
    return !isEmpty(appliedFilters);
  }

  get pagination() {
    return this.props.pagination;
  }

  get searchProps() {
    if (!this.props.showSearch) return null;
    return {
      value: this.state.filters.keyword || "",
      onChange: event => this.setFilters(event, "keyword")
    };
  }

  get texts() {
    if (!this.props.texts) return [];
    return this.props.texts.map(text => {
      return {
        label: text.attributes.title,
        value: text.id
      };
    });
  }

  get hasTexts() {
    return this.texts.length > 0;
  }

  get sections() {
    if (!this.props.sections) return [];
    return this.props.sections.map(({ name, id }) => {
      return {
        label: name,
        value: id
      };
    });
  }

  get hasSections() {
    return this.sections.length > 0;
  }

  get memberships() {
    if (!this.props.memberships) return [];

    return this.props.memberships.map(rgm => {
      return {
        label: rgm.attributes.name,
        value: rgm.id
      };
    });
  }

  get hasMemberships() {
    return this.memberships.length > 0;
  }

  get textFilter() {
    if (!this.hasTexts) return null;

    return {
      label: "Filter by text",
      value: this.state.filters?.text || "",
      onChange: event => this.setFilters(event, "text"),
      options: [{ label: "All texts", value: "" }, ...this.texts]
    };
  }

  get sectionFilter() {
    if (!this.hasSections) return null;

    return {
      label: "Filter by text section",
      value: this.state.filters?.textSection || "",
      onChange: event => this.setFilters(event, "textSection"),
      options: [{ label: "All sections", value: "" }, ...this.sections]
    };
  }

  get membershipFilter() {
    if (!this.hasMemberships) return null;

    return {
      label: "Filter by member",
      value: this.state.filters?.readingGroupMembership || "",
      onChange: event => this.setFilters(event, "readingGroupMembership"),
      options: [{ label: "All members", value: "" }, ...this.memberships]
    };
  }

  get filters() {
    const filters = [
      this.textFilter,
      this.sectionFilter,
      this.membershipFilter
    ];
    return filters.filter(Boolean);
  }

  filterChanged(prevState) {
    if (this.state.filter.text !== prevState.filter.text) return true;
    if (this.state.filter.textSection !== prevState.filter.textSection)
      return true;
    return (
      this.state.filter.readingGroupMembership !==
      prevState.filter.readingGroupMembership
    );
  }

  setFilters = (event, label) => {
    const value = event.target.value;
    const filters = { ...this.state.filters };
    filters[label] = value;
    if (label === "keyword") return this.setState({ filters });
    this.setState({ filters }, () =>
      this.props.filterChangeHandler(this.state.filters)
    );
  };

  resetFilters = () => {
    const newState = this.initialState(this.props.initialFilterState);

    this.setState(newState, () =>
      this.props.filterChangeHandler(this.state.filters)
    );
  };

  render() {
    const filterCount = this.props.showSearch
      ? this.filters.length + 1
      : this.filters.length;
    const endClassName = classNames({
      "notes-filter-container__end": true,
      [`notes-filter-container__end--count-${filterCount}`]: true
    });

    return (
      <div className="notes-filter-container">
        <div className="notes-filter-container__start">
          <Utility.EntityCount
            pagination={this.pagination}
            singularUnit="Note"
            pluralUnit="Notes"
          />
        </div>
        <div className={endClassName}>
          <ListFilters
            searchProps={this.searchProps}
            filters={this.filters}
            onSubmit={() => this.props.filterChangeHandler(this.state.filters)}
            onReset={this.resetFilters}
            showResetButton={this.showResetButton}
          />
        </div>
      </div>
    );
  }
}
