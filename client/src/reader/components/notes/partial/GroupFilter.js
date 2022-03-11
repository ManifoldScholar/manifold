import React, { Component } from "react";
import PropTypes from "prop-types";
import { ReaderContext } from "helpers/contexts";

import { ListFilters } from "global/components/list";
import { withTranslation } from "react-i18next";

class GroupFilter extends Component {
  static displayName = "Notes.Partial.GroupFilter";

  static propTypes = {
    readingGroups: PropTypes.array.isRequired,
    filterChangeHandler: PropTypes.func,
    setAnnotationOverlayReadingGroup: PropTypes.func,
    selectedGroup: PropTypes.string,
    t: PropTypes.func
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
      label: this.props.t("glossary.reading_group_title_case_one"),
      value: this.selectedGroup,
      options: [
        {
          label: this.props.t("reader.menus.notes.my_notes"),
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
        <ListFilters
          filters={this.filters}
          updateFilterState={this.handleFilterChange}
          hideSearch
        />
      </div>
    );
  }
}

export default withTranslation()(GroupFilter);
