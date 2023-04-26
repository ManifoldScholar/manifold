import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import withConfirmation from "hoc/withConfirmation";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { exportTargetsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";
import Form from "./Form";

const { request, flush } = entityStoreActions;

export class ExportTargetsEditContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      exportTarget: select(requests.beExportTarget, state.entityStore)
    };
  };

  static displayName = "ExportTargets.Edit";

  static propTypes = {
    exportTarget: PropTypes.object,
    match: PropTypes.object.isRequired,
    confirm: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    t: PropTypes.func
  };

  componentDidMount() {
    this.fetchExportTarget(this.exportTargetID);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.exportTargetID) {
      this.fetchExportTarget(this.exportTargetID);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush([requests.beExportTarget]));
  }

  get exportTarget() {
    return this.props.exportTarget;
  }

  get exportTargetID() {
    return this.props.match.params.id;
  }

  destroyExportTarget = () => {
    const { dispatch, history } = this.props;
    const call = exportTargetsAPI.destroy(this.exportTargetID);
    const options = { removes: this.exportTarget };
    const exportTargetRequest = request(
      call,
      requests.beExportTargetDestroy,
      options
    );

    dispatch(exportTargetRequest).promise.then(() => {
      history.push(lh.link("backendSettingsExportTargets"));
    });
  };

  handleExportTargetDestroy = () => {
    const heading = this.props.t("modals.delete_export_target");
    const message = this.props.t("modals.confirm_body");

    this.props.confirm(heading, message, this.destroyExportTarget);
  };

  fetchExportTarget(id) {
    const call = exportTargetsAPI.show(id);
    const exportTargetRequest = request(call, requests.beExportTarget);

    this.props.dispatch(exportTargetRequest);
  }

  render() {
    if (!this.exportTarget) return null;
    const attr = this.exportTarget.attributes;

    return (
      <section>
        <Layout.DrawerHeader
          title={attr.name}
          buttons={[
            {
              onClick: this.handleExportTargetDestroy,
              icon: "delete32",
              label: this.props.t("actions.delete"),
              className: "utility-button__icon--notice"
            }
          ]}
        />
        <Form model={this.exportTarget} />
      </section>
    );
  }
}

export default withTranslation()(
  withConfirmation(connectAndFetch(ExportTargetsEditContainer))
);
