import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { GroupSettingsForm } from "frontend/components/reading-group/forms";
import connectAndFetch from "utils/connectAndFetch";
import Navigation from "backend/components/navigation";

class ReadingGroupsNewContainer extends PureComponent {
  static propTypes = {
    onSuccess: PropTypes.func.isRequired
  };

  render() {
    return (
      <section>
        <Navigation.DrawerHeader title="New Reading Group" />
        <GroupSettingsForm mode="new" onSuccess={this.props.onSuccess} />
      </section>
    );
  }
}

export default connectAndFetch(ReadingGroupsNewContainer);
