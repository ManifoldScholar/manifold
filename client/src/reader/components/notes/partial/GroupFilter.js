import React, { Component } from "react";
import PropTypes from "prop-types";
import { ReaderContext } from "helpers/contexts";

import Filters from "global/components/list/Filters";

class GroupFilter extends Component {
  static displayName = "Notes.Partial.GroupFilter";

  static propTypes = {
    readingGroups: PropTypes.array.isRequired,
    filterChangeHandler: PropTypes.func,
    setAnnotationOverlayReadingGroup: PropTypes.func,
    selectedGroup: PropTypes.string
  };

  static contextType = ReaderContext;

  get readingGroups() {
    return this.props.readingGroups;
  }

  get selectedGroup() {
    return this.props.selectedGroup;
  }

  get groupOptions() {
    return this.readingGroups.map(({ id, attributes: { name } }) => ({
      value: id,
      label: name
    }));
  }

  handleFilterChange = ({ target: { value } }) => {
    this.props.filterChangeHandler("readingGroup", value);
    this.props.setAnnotationOverlayReadingGroup(value);
  };

  get groupFilter() {
    return {
      label: "Reading Group",
      value: this.selectedGroup,
      options: [
        {
          label: "My Notes",
          value: "me"
        },
        ...this.groupOptions
      ],
      onChange: this.handleFilterChange
    };
  }

  get filters() {
    return [this.groupFilter];
  }

  render() {
    return (
      <div className="notes-group-filter">
        <Filters filters={this.filters} />
      </div>
    );
  }
}

export default GroupFilter;
