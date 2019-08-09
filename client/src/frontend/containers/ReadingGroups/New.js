import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ReadingGroupForm from "frontend/components/reading-group/Form";
import connectAndFetch from "utils/connectAndFetch";

class ReadingGroupsNewContainer extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    closeUrl: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.defaultGroup = {
      attributes: { privacy: "private" }
    };
  }

  closeDrawer = () => {
    const { history, closeUrl } = this.props;
    history.push(closeUrl);
  };

  render() {
    return (
      <ReadingGroupForm
        mode="new"
        group={this.defaultGroup}
        onSuccess={this.closeDrawer}
      />
    );
  }
}

export default connectAndFetch(ReadingGroupsNewContainer);
