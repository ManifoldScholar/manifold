import React, { PureComponent } from "react";
import connectAndFetch from "utils/connectAndFetch";
import ReadingGroupForm from "frontend/components/reading-group/Form";
import PropTypes from "prop-types";
import Navigation from "backend/components/navigation";
import { readingGroupsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;
import withConfirmation from "hoc/with-confirmation";
import config from "config";

class ReadingGroupEditContainer extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    closeUrl: PropTypes.string.isRequired
  };

  closeDrawer = () => {
    const { history, closeUrl } = this.props;
    history.push(closeUrl);
  };

  handleDelete = () => {
    const { heading, message } = config.app.locale.dialogs.readingGroup.destroy;
    this.props.confirm(heading, message, () => {
      const { readingGroup } = this.props;
      const call = readingGroupsAPI.destroy(readingGroup.id);
      const options = { removes: this.props.readingGroup };
      const readingGroupRequest = request(
        call,
        requests.feReadingGroupDestroy,
        options
      );
      this.props.dispatch(readingGroupRequest).promise.then(() => {
        this.redirectToList();
      });
    });
  };

  redirectToList() {
    const { history } = this.props;
    history.push(lh.link("frontendReadingGroups"));
  }

  render() {
    return (
      <section>
        <Navigation.DrawerHeader
          title="Edit Reading Group"
          buttons={[
            {
              onClick: this.handleDelete,
              icon: "delete32",
              label: "Delete",
              iconClass: "utility-button__icon--notice"
            }
          ]}
        />
        <ReadingGroupForm
          mode="edit"
          group={this.props.readingGroup}
          onSuccess={this.closeDrawer}
        />
      </section>
    );
  }
}

export default connectAndFetch(withConfirmation(ReadingGroupEditContainer));
