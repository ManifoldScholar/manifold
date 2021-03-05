import React from "react";
import PropTypes from "prop-types";
import { UID } from "react-uid";
import Utility from "global/components/utility";
import Filter from "./Filter";
import isEmpty from "lodash/isEmpty";
import omitBy from "lodash/omitBy";

export default class SelectFilter extends React.PureComponent {
  static propTypes = {
    readingGroup: PropTypes.object.isRequired,
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

  get members() {
    const { readingGroup } = this.props;
    return readingGroup.relationships.readingGroupMemberships.map(rgm => {
      return {
        label: this.memberLabel(rgm),
        value: rgm.id
      };
    });
  }

  get titles() {
    const { readingGroup } = this.props;
    return readingGroup.relationships.texts.map(text => {
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
    const { pagination } = this.props;

    return (
      <div className={"notes-filter"}>
        <Utility.EntityCount
          pagination={pagination}
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
                value={this.state.filter ? this.state.filter.title : undefined}
                onChange={this.updateTextFilter}
                label={"All Texts:"}
                options={this.titles}
              />
              <Filter
                value={
                  this.state.filter
                    ? this.state.filter.readingGroupMembership
                    : undefined
                }
                onChange={this.updateMemberFilter}
                label={"All Members:"}
                options={this.members}
              />
            </div>
          )}
        </UID>
      </div>
    );
  }
}
