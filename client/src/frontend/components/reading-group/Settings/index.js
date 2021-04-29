import React, { PureComponent } from "react";
import { GroupSettingsForm } from "frontend/components/reading-group/forms";
import PropTypes from "prop-types";
import { UnmountClosed as Collapse } from "react-collapse";
import Navigation from "backend/components/navigation";
import { readingGroupsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import { entityStoreActions } from "actions";
import { DuplicatePanel } from "./panels";

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

  constructor(props) {
    super(props);

    this.state = {
      showActionPanel: null
    };
  }

  get readingGroup() {
    return this.props.readingGroup;
  }

  get links() {
    return this.readingGroup.links;
  }

  get duplicateLink() {
    return this.links.clone;
  }

  get canDuplicate() {
    return Object.keys(this.links).includes("clone");
  }

  get buttons() {
    const iconClass = "utility-button__icon";
    const buttons = [
      {
        onClick: this.handleDelete,
        icon: "delete24",
        label: "Delete",
        iconClass: `${iconClass} ${iconClass}--notice`
      }
    ];

    if (this.canDuplicate) {
      buttons.unshift({
        onClick: () => this.handleDrawerToggle("duplicate"),
        icon: "duplicate24",
        label: "Duplicate",
        iconClass,
        ariaProps: {
          "aria-expanded": this.state.showActionPanel === "duplicate",
          "aria-controls": "group-settings-duplicate-region"
        }
      });
    }

    return buttons;
  }

  handleDrawerToggle = action => {
    if (this.state.showActionPanel === action)
      return this.setState({ showActionPanel: null });
    this.setState({ showActionPanel: action });
  };

  cancelAction = () => {
    this.setState({ showActionPanel: null });
  };

  doDuplicate = ({ openOnProceed }) => {
    const { href: endpoint, meta } = this.duplicateLink;
    const call = {
      endpoint,
      options: {},
      ...meta
    };
    const duplicateRequest = request(call, requests.feReadingGroupClone, {});
    this.props.dispatch(duplicateRequest).promise.then(() => {
      if (openOnProceed) {
        this.redirectToDuplicatedGroup();
      } else {
        this.setState({ showActionPanel: null });
      }
    });
  };

  handleDelete = () => {
    const { heading, message } = config.app.locale.dialogs.readingGroup.destroy;
    this.props.confirm(heading, message, () => {
      const { readingGroup } = this.props;
      const call = readingGroupsAPI.destroy(readingGroup.id);
      const options = { removes: this.readingGroup };
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
          buttons={this.buttons}
          buttonLayout="inline"
          className="drawer-header--pad-bottom-small"
        />
        <div role="region" id="group-settings-duplicate-region">
          <Collapse isOpened={this.state.showActionPanel === "duplicate"}>
            <DuplicatePanel
              readingGroup={this.readingGroup}
              onProceed={this.doDuplicate}
              onCancel={this.cancelAction}
            />
          </Collapse>
        </div>
        <GroupSettingsForm
          mode="edit"
          group={this.props.readingGroup}
          onSuccess={this.props.closeDrawer}
        />
      </section>
    );
  }
}

export default withConfirmation(ReadingGroupSettings);
