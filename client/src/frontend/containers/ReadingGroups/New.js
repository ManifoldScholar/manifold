import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { GroupSettingsForm } from "frontend/components/reading-group/forms";
import connectAndFetch from "utils/connectAndFetch";
import Navigation from "backend/components/navigation";

class ReadingGroupsNewContainer extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    closeUrl: PropTypes.string.isRequired
  };

  closeDrawer = () => {
    const { history, closeUrl } = this.props;
    history.push(closeUrl);
  };

  render() {
    return (
      <section>
        <Navigation.DrawerHeader title="New Reading Group" />
        <GroupSettingsForm mode="new" onSuccess={this.closeDrawer} />
      </section>
    );
  }
}

export default connectAndFetch(ReadingGroupsNewContainer);
