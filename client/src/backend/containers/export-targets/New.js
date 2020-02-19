import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { requests } from "api";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";
import Form from "./Form";

export class ExportTargetsNewContainer extends PureComponent {
  static displayName = "ExportTargets.New";

  static propTypes = {
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.defaultExportTarget = {
      attributes: {
        strategy: "sftp_key",
        configuration: {
          targetNameFormat: "%s.%e"
        }
      }
    };
  }

  redirectToExportTarget(exportTarget) {
    const path = lh.link("backendRecordsExportTargets", exportTarget.id);
    this.props.history.push(path, { keepNotifications: true });
  }

  render() {
    return (
      <section>
        <Navigation.DrawerHeader title="New Export Target" />
        <Form
          model={this.defaultExportTarget}
          onSuccess={exportTarget => this.redirectToExportTarget(exportTarget)}
          options={{ adds: requests.beExportTargets }}
        />
      </section>
    );
  }
}

export default connectAndFetch(ExportTargetsNewContainer);
