import React from "react";
import PropTypes from "prop-types";
import { UID } from "react-uid";
import Utility from "global/components/utility";
import Filter from "./Filter";
import isEmpty from "lodash/isEmpty";
import omitBy from "lodash/omitBy";

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
    return this.props.texts.map(text => {
      return {
        label: text.attributes.title,
        value: text.id
      };
    });
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
      <div className={"notes-filter"}>
        <Utility.EntityCount
          pagination={this.pagination}
          singularUnit="Note"
          pluralUnit="Notes"
        />
        <UID name={id => `notes-filter-${id}`}>
          {id => (
            <div
              role="group"
              aria-labelledby={`${id}-header`}
              className={"notes-filter__dropdown-container"}
            >
              <p id={`${id}-header`} className="screen-reader-text">
                Notes filters
              </p>
              <Filter
                value={this.state.filter?.text || ""}
                onChange={this.updateTextFilter}
                label={"Filter by text"}
                allOption={{ label: "All texts", value: "" }}
                options={this.texts}
              />
              {this.hasMemberships && (
                <Filter
                  value={this.state.filter?.readingGroupMembership || ""}
                  onChange={this.updateMemberFilter}
                  label={"Filter by member"}
                  allOption={{ label: "All members", value: "" }}
                  options={this.memberships}
                />
              )}
            </div>
          )}
        </UID>
      </div>
    );
  }
}
