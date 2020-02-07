import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { entityStoreActions } from "actions";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";

import { select, meta } from "utils/entityUtils";
import { exportTargetsAPI, projectExportationsAPI, requests } from "api";
import Form from "/global/components/form";
import FormContainer from "global/containers/form";
import lh from "helpers/linkHandler";
import Authorize from "hoc/authorize";

const { request } = entityStoreActions;

export class ProjecExportations extends PureComponent {
  static mapStateToProps = state => {
    return {
      projectExportations: select(
        requests.beProjectExportations,
        state.entityStore
      ),
      projectExportationsMeta: meta(
        requests.beProjectExportations,
        state.entityStore
      ),
      exportTargets: select(requests.beExportTargets, state.entityStore)
    };
  };

  static displayName = "Project.Exportations.List";

  static propTypes = {
    // the following arguments are required to render the component,
    // but can be null until the async network request is fulfilled
    /* eslint-disable react/require-default-props */
    projectExportations: PropTypes.array,
    projectExportationsMeta: PropTypes.object,
    exportTargets: PropTypes.array,
    /* eslint-enable react/require-default-props */
    project: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    projectExportationsPerPage: PropTypes.number
  };

  static defaultProps = {
    projectExportationsPerPage: 20
  };

  componentDidMount() {
    this.fetchExportTargets();
  }

  get exportTargetSelectOptions() {
    const targets = [{ label: "", value: "", internalValue: "" }];
    const { exportTargets } = this.props;

    if (!isArray(exportTargets)) return targets;

    exportTargets.forEach(exportTarget =>
      targets.push({
        label: exportTarget.attributes.name,
        value: exportTarget.id,
        internalValue: exportTarget.id
      })
    );
    return targets;
  }

  dispatch(action) {
    this.props.dispatch(action);
  }

  fetchExportTargets() {
    const action = request(exportTargetsAPI.index(), requests.beExportTargets);
    this.dispatch(action);
  }

  render() {
    const { project } = this.props;

    return (
      <Authorize
        entity={project}
        ability="manageProjectExportations"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <FormContainer.Form
          className="form-secondary"
          name={requests.beProjectExportationCreate}
          model={{
            attributes: {
              project_id: project.id,
              export_target_id: ""
            }
          }}
          update={() => null}
          create={projectExportationsAPI.create}
          onSuccess={() => null}
          doNotWarn
        >
          <Form.FieldGroup label="New Project Export" horizontal>
            <Form.Select
              name="attributes[export_target_id]"
              label="Export Target"
              options={this.exportTargetSelectOptions}
            />
            <Form.Save text="Export" wide={false} />
          </Form.FieldGroup>
        </FormContainer.Form>
      </Authorize>
    );
  }
}

export default connect(ProjecExportations.mapStateToProps)(ProjecExportations);
