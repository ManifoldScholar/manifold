import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { entityStoreActions } from "actions";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import isArray from "lodash/isArray";
import { select, meta } from "utils/entityUtils";
import {
  projectsAPI,
  exportTargetsAPI,
  projectExportationsAPI,
  requests
} from "api";
import EntitiesList, {
  Button,
  ProjectExportationRow
} from "backend/components/list/EntitiesList";
import Form from "/global/components/form";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";
import * as Styled from "./styles";

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
    projectExportationsPerPage: PropTypes.number,
    t: PropTypes.func
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
      {
        label: this.props.t("projects.forms.exports.location_placeholder"),
        value: "",
        internalValue: ""
      }
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
      projectExportationsMeta,
      t
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
        <Styled.Form
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
          <Form.FieldGroup label="Project Exports">
            {this.hasExportTargets && (
              <Form.Instructions
                instructions={t("projects.forms.exports.instructions")}
              />
            )}
            {!this.hasExportTargets && (
              <>
                <Authorize entity="exportTarget" ability="create">
                  <Form.Instructions
                    instructions={t("projects.forms.exports.no_targets")}
                  />
                  <div>
                    <Button
                      path={lh.link("backendSettingsExportTargetsNew")}
                      text={t("projects.forms.exports.add_target_label")}
                      type="add"
                    />
                  </div>
                </Authorize>
                <Authorize
                  entity="exportTarget"
                  ability="create"
                  successBehavior="hide"
                >
                  <Form.Instructions
                    instructions={t(
                      "projects.forms.exports.no_targets_unauthorized"
                    )}
                  />
                </Authorize>
              </>
            )}
            {this.hasExportTargets && (
              <>
                <Form.Select
                  rounded
                  wide
                  name="attributes[export_target_id]"
                  label={t("projects.forms.exports.new_export_label")}
                  options={this.exportTargetSelectOptions}
                />
                <Form.Errors wide names={["attributes[base]"]} />
                <Form.Save
                  text={t("projects.forms.exports.save")}
                  wide={false}
                />
              </>
            )}
          </Form.FieldGroup>
        </Styled.Form>
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
              unit={t("glossary.export", {
                count: projectExportations?.length
              })}
            />
          </div>
        )}
      </Authorize>
    );
  }
}

export default withTranslation()(
  connect(ProjecExportations.mapStateToProps)(ProjecExportations)
);
