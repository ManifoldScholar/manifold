import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { ReaderContext } from "helpers/contexts";
import withReadingGroups from "hoc/with-reading-groups";

import Filters from "global/components/list/Filters";

class GroupFilter extends PureComponent {
  static displayName = "Notes.Partial.GroupFilter";

  static propTypes = {
    readingGroups: PropTypes.array.isRequired,
    onReadingGroupChange: PropTypes.func,
    filter: PropTypes.object
  };

  static contextType = ReaderContext;

  constructor(props) {
    super(props);
    const { filter } = props;
    this.state = {
      selectedGroup: filter && filter.reading_group ? filter.reading_group : ""
    };
  }

  get readingGroups() {
    return this.props.readingGroups;
  }

  handleReadingGroupChange = event => {
    event.preventDefault();
    const value = event.target.value;
    const { onReadingGroupChange } = this.props;

    this.setState({ selectedGroup: value });

    if (onReadingGroupChange) onReadingGroupChange("reading_group", value);
  };

  renderSelect() {
    const { selectedGroup } = this.state;
    const options = this.readingGroups.map(({ id, attributes: { name } }) => ({
      value: id,
      label: name
    }));

    const filters = [
      {
        label: "Reading Group",
        value: selectedGroup,
        options: [
          {
            label: "My Notes",
            value: ""
          },
          ...options
        ],
        onChange: this.handleReadingGroupChange
      }
    ];

    return <Filters filters={filters} />;
  }

  render() {
    return <div className="notes-group-filter">{this.renderSelect()}</div>;
  }
}

export default withReadingGroups(GroupFilter);
