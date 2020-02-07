import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import withConfirmation from "hoc/with-confirmation";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { exportTargetsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";
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
    // export target information is required, but can be null/undefined until
    // the async network request is fulfilled
    exportTarget: PropTypes.object, // eslint-disable-line react/require-default-props
    match: PropTypes.object.isRequired,
    confirm: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
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
      history.push(lh.link("backendRecordsExportTargets"));
    });
  };

  handleExportTargetDestroy = () => {
    const heading = "Are you sure you want to delete this export target?";
    const message = "This action cannot be undone.";

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
      <div>
        <Navigation.DrawerHeader
          title={attr.name}
          buttons={[
            {
              onClick: this.handleExportTargetDestroy,
              icon: "delete32",
              label: "Delete",
              iconClass: "utility-button__icon--notice"
            }
          ]}
        />

        <section className="form-section form-section--primary">
          <Form model={this.exportTarget} />
        </section>
      </div>
    );
  }
}

export default withConfirmation(connectAndFetch(ExportTargetsEditContainer));
