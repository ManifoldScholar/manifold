import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { entityStoreActions } from "actions";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";
import { select, meta } from "utils/entityUtils";
import {
  projectsAPI,
  exportTargetsAPI,
  projectExportationsAPI,
  requests,
  entitlementsAPI
} from "api";
import EntitiesList, {
  Button,
  ProjectExportationRow
} from "backend/components/list/EntitiesList";
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
    projectExportations: PropTypes.array,
    projectExportationsMeta: PropTypes.object,
    exportTargets: PropTypes.array,
    project: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    projectExportationsPerPage: PropTypes.number
  };

  static defaultProps = {
    projectExportationsPerPage: 20
  };

  componentDidMount() {
    this.fetchExportations(1);
    this.fetchExportTargets();
  }

  get exportTargetSelectOptions() {
    const targets = [
      { label: "Choose an Export Location", value: "", internalValue: "" }
    ];
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

  get hasExportTargets() {
    return this.props.exportTargets && this.props.exportTargets.length > 0;
  }

  pageChangeHandlerCreator = page => {
    return () => this.fetchExportations(page);
  };

  onDelete = projectExportation => {
    const { dispatch } = this.props;

    const options = projectExportationsAPI.destroy(projectExportation.id);

    const action = request(options, requests.beProjectExportationDestroy, {
      refreshes: requests.beProjectExportations
    });

    dispatch(action);
  };

  dispatch(action) {
    this.props.dispatch(action);
  }

  fetchExportTargets() {
    const action = request(exportTargetsAPI.index(), requests.beExportTargets);
    this.dispatch(action);
  }

  fetchExportations(page) {
    const pagination = {
      number: page,
      size: this.props.projectExportationsPerPage
    };
    const action = request(
      projectsAPI.project_exportations(this.props.project.id, {}, pagination),
      requests.beProjectExportations
    );
    this.dispatch(action);
  }

  render() {
    const active = false;
    const {
      projectExportations,
      project,
      projectExportationsMeta
    } = this.props;

    if (!projectExportations || !projectExportationsMeta) return null;

    const { pagination } = projectExportationsMeta;

    return (
      <Authorize
        entity={project}
        ability="manageProjectExportations"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <FormContainer.Form
          className="form-secondary"
          suppressModelErrors
          name={requests.beProjectExportationCreate}
          model={{
            attributes: {
              project_id: project.id,
              export_target_id: ""
            }
          }}
          update={() => null}
          create={projectExportationsAPI.create}
          onSuccess={() => this.fetchExportations(1)}
          doNotWarn
        >
          <Form.FieldGroup label="Project Exports" wide horizontal>
            {this.hasExportTargets && (
              <div className="instructional-copy">
                Manifold makes it possible to export a preservation copy of your
                project to an external export target. To start an export, select
                one of the configured targets below and press the button. The
                export will happen in the background and can take a few minutes
                to complete.
              </div>
            )}
            {!this.hasExportTargets && (
              <>
                <Authorize entity="exportTarget" ability="create">
                  <div className="instructional-copy">
                    No export targets have been created on this instance. Export
                    targets can be managed in the backend under records &gt;
                    export targets.
                  </div>
                  <Button
                    path={lh.link("backendRecordsExportTargetsNew")}
                    text="Create a new export target"
                    type="add"
                  />
                </Authorize>
                <Authorize
                  entity="exportTarget"
                  ability="create"
                  successBehavior="hide"
                >
                  <span>
                    No export targets have been created on this instance. Only
                    administrators may create export targets. To setup export
                    targets, please contact the administrator of this Manifold
                    instance.
                  </span>
                </Authorize>
              </>
            )}
            {this.hasExportTargets && (
              <>
                <Form.Select
                  rounded
                  wide
                  name="attributes[export_target_id]"
                  label="New Project Export:"
                  options={this.exportTargetSelectOptions}
                />
                <Form.Errors wide names={["attributes[base]"]} />
                <Form.Save text="Export Project" wide={false} />
              </>
            )}
          </Form.FieldGroup>
        </FormContainer.Form>
        {this.hasExportTargets && (
          <div style={{ marginTop: 25 }}>
            <EntitiesList
              entityComponent={ProjectExportationRow}
              entityComponentProps={{ active, onDelete: this.onDelete }}
              showCount
              indented
              pagination={pagination}
              callbacks={{
                onPageClick: this.pageChangeHandlerCreator
              }}
              entities={projectExportations}
              unit={{
                singular: "export",
                plural: "exports"
              }}
            />
          </div>
        )}
      </Authorize>
    );
  }
}

export default connect(ProjecExportations.mapStateToProps)(ProjecExportations);
