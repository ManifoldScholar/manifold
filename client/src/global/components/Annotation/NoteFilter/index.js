import React from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import omitBy from "lodash/omitBy";
import Utility from "global/components/utility";
import { ListFilters } from "global/components/list";

export default class AnnotationNoteFilter extends React.PureComponent {
  static displayName = "Annotation.NoteFilter";

  static propTypes = {
    texts: PropTypes.array,
    memberships: PropTypes.array,
    pagination: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      filter: props.initialFilterState
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.filterChanged(prevState)) {
      const filters = omitBy(this.state.filter, isEmpty);
      this.props.updateAnnotations(filters);
    }
  }

  filterChanged(prevState) {
    if (this.state.filter.text !== prevState.filter.text) return true;
    return (
      this.state.filter.readingGroupMembership !==
      prevState.filter.readingGroupMembership
    );
  }

  get pagination() {
    return this.props.pagination;
  }

  get memberships() {
    if (!this.props.memberships) return [];

    return this.props.memberships.map(rgm => {
      return {
        label: this.memberLabel(rgm),
        value: rgm.id
      };
    });
  }

  get hasMemberships() {
    return this.props.memberships?.length > 0;
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

  get textFilter() {
    return {
      label: "Filter by text",
      value: this.state.filter?.text || "",
      onChange: this.updateTextFilter,
      options: [{ label: "All texts", value: "" }, ...this.texts]
    };
  }

  get membershipsFilter() {
    if (!this.hasMemberships) return null;

    return {
      label: "Filter by member",
      value: this.state.filter?.readingGroupMembership || "",
      onChange: this.updateMemberFilter,
      options: [{ label: "All members", value: "" }, ...this.memberships]
    };
  }

  get filters() {
    const filters = [this.textFilter, this.membershipsFilter];
    return filters.filter(Boolean);
  }

  memberLabel(readingGroupMembership) {
    return readingGroupMembership.attributes.name;
  }

  updateTextFilter = event => {
    const text = event.target.value;
    const filter = { ...this.state.filter, text };
    this.setState({ filter });
  };

  updateMemberFilter = event => {
    const readingGroupMembership = event.target.value;
    const filter = { ...this.state.filter, readingGroupMembership };
    this.setState({ filter });
  };

  render() {
    return (
      <div className="notes-filter-container">
        <div className="notes-filter-container__start">
          <Utility.EntityCount
            pagination={this.pagination}
            singularUnit="Note"
            pluralUnit="Notes"
          />
        </div>
        <div
          className={`notes-filter-container__end notes-filter-container__end--count-${this.filters.length}`}
        >
          <ListFilters filters={this.filters} />
        </div>
      </div>
    );
  }
}
