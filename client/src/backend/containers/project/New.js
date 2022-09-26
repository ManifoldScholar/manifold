import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation, Trans } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import Layout from "backend/components/layout";
import Navigation from "backend/components/navigation";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { projectsAPI } from "api";
import lh from "helpers/linkHandler";

import Authorize from "hoc/Authorize";

export class ProjectNewContainer extends PureComponent {
  static displayName = "Project.New";

  static propTypes = {
    history: PropTypes.object,
    project: PropTypes.object,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.defaultProject = {
      attributes: {
        configuration: {
          multipleTexts: true,
          resources: true,
          markdown: true,
          recentActivity: true
        }
      }
    };
  }

  get layoutInstructions() {
    return (
      <Trans
        i18nKey="backend_entities.projects.forms.new.layout_instructions"
        components={[
          <a
            href="https://manifoldscholar.github.io/manifold-docusaurus/docs/backend/projects#creating-projects"
            target="_blank"
            rel="noopener noreferrer"
          >
            #
          </a>
        ]}
      />
    );
  }

  redirectToProject(project) {
    const path = lh.link("backendProject", project.id);
    this.props.history.push(path);
  }

  handleSuccess = project => {
    this.redirectToProject(project);
  };

  render() {
    const t = this.props.t;
    return (
      <Authorize
        entity={"project"}
        ability="create"
        failureNotification
        failureRedirect={lh.link("backend")}
      >
        <div>
          <Navigation.DetailHeader
            type="project"
            title={t("backend_entities.projects.forms.new.title")}
            showUtility={false}
            note={t("backend_entities.projects.forms.new.instructions")}
          />
          <Layout.BackendPanel>
            <FormContainer.Form
              model={this.defaultProject}
              name="backend-create-project"
              update={projectsAPI.update}
              create={projectsAPI.create}
              onSuccess={this.handleSuccess}
              className="form-secondary"
            >
              <Form.FieldGroup
                label={t(
                  "backend_entities.projects.forms.new.title_descript_header"
                )}
              >
                <Form.TextInput
                  validation={["required"]}
                  focusOnMount
                  label={t("backend_entities.projects.forms.title_label")}
                  name="attributes[title]"
                  placeholder={t(
                    "backend_entities.projects.forms.title_placeholder"
                  )}
                />
                <Form.TextInput
                  label={t("backend_entities.projects.forms.subtitle_label")}
                  name="attributes[subtitle]"
                  placeholder={t(
                    "backend_entities.projects.forms.subtitle_placeholder"
                  )}
                />
                <Form.TextArea
                  label={t(
                    "backend_entities.projects.forms.new.descript_label"
                  )}
                  name="attributes[description]"
                  height={100}
                  wide
                />
              </Form.FieldGroup>
              <Form.FieldGroup
                label={t("backend_entities.projects.forms.new.layout_header")}
                instructions={this.layoutInstructions}
              >
                <Form.Radios
                  label={t("glossary.text_title_case_other")}
                  prompt={t("backend_entities.projects.forms.new.texts_prompt")}
                  name="attributes[configuration][multipleTexts]"
                  instructions={t(
                    "backend_entities.projects.forms.new.texts_instructions"
                  )}
                  options={[
                    { label: t("common.yes"), value: true },
                    { label: t("common.no"), value: false }
                  ]}
                  inline
                  wide
                />
                <Form.Radios
                  label={t("glossary.resource_title_case_other")}
                  prompt={t(
                    "backend_entities.projects.forms.new.resources_prompt"
                  )}
                  name="attributes[configuration][resources]"
                  instructions={t(
                    "backend_entities.projects.forms.new.resources_instructions"
                  )}
                  options={[
                    { label: t("common.yes"), value: true },
                    { label: t("common.no"), value: false }
                  ]}
                  inline
                  wide
                />
                <Form.Radios
                  label={t(
                    "backend_entities.projects.forms.new.extended_descript_label"
                  )}
                  prompt={t(
                    "backend_entities.projects.forms.new.extended_descript_prompt"
                  )}
                  name="attributes[configuration][markdown]"
                  instructions={t(
                    "backend_entities.projects.forms.new.extended_descript_instructions"
                  )}
                  options={[
                    { label: t("common.yes"), value: true },
                    { label: t("common.no"), value: false }
                  ]}
                  inline
                  wide
                />
                <Form.Radios
                  label={t("backend_entities.projects.activity")}
                  prompt={t(
                    "backend_entities.projects.forms.new.activity_prompt"
                  )}
                  name="attributes[configuration][recentActivity]"
                  instructions={t(
                    "backend_entities.projects.forms.new.activity_instructions"
                  )}
                  options={[
                    { label: t("common.yes"), value: true },
                    { label: t("common.no"), value: false }
                  ]}
                  inline
                  wide
                />
              </Form.FieldGroup>
              <Form.Save
                text={t("backend_entities.projects.forms.new.save")}
                cancelRoute={lh.link("backendProjects")}
              />
            </FormContainer.Form>
          </Layout.BackendPanel>
        </div>
      </Authorize>
    );
  }
}

export default withTranslation()(connectAndFetch(ProjectNewContainer));
