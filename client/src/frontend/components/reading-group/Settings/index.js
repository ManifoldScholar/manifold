import React, { PureComponent } from "react";
import ReadingGroupForm from "frontend/components/reading-group/Form";
import PropTypes from "prop-types";
import Navigation from "backend/components/navigation";
import { readingGroupsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;
import withConfirmation from "hoc/with-confirmation";
import config from "config";

class ReadingGroupSettings extends PureComponent {
  static displayName = "ReadingGroup.Settings";

  static propTypes = {
    history: PropTypes.object.isRequired,
    readingGroup: PropTypes.object.isRequired,
    closeDrawer: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired
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
          onSuccess={this.props.closeDrawer}
        />
      </section>
    );
  }
}

export default withConfirmation(ReadingGroupSettings);
