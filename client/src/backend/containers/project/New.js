import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation, Trans } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import Layout from "backend/components/layout";
import PageHeader from "backend/components/layout/PageHeader";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { projectsAPI } from "api";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";

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
        i18nKey="projects.forms.new.layout_instructions"
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

    const breadcrumbs = [
      { to: null, label: t("glossary.project_title_case_other") },
      {
        to: lh.link("backendProjects"),
        label: t("pages.projects_all")
      },
      {
        to: lh.link("backendProjectsNew"),
        label: t("common.new")
      }
    ];

    return (
      <Authorize
        entity={"project"}
        ability="create"
        failureNotification
        failureRedirect={lh.link("backend")}
      >
        <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
        <HeadContent
          title={`${t(`titles.project_new`)} | ${t("common.admin")}`}
          appendDefaultTitle
        />
        <div>
          <PageHeader
            type="project"
            title={t("projects.forms.new.title")}
            note={t("projects.forms.new.instructions")}
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
                label={t("projects.forms.new.title_descript_header")}
              >
                <Form.TextInput
                  validation={["required"]}
                  focusOnMount
                  label={t("projects.forms.title_label")}
                  name="attributes[title]"
                  placeholder={t("projects.forms.title_placeholder")}
                />
                <Form.TextInput
                  label={t("projects.forms.subtitle_label")}
                  name="attributes[subtitle]"
                  placeholder={t("projects.forms.subtitle_placeholder")}
                />
                <Form.TextArea
                  label={t("projects.forms.new.descript_label")}
                  name="attributes[description]"
                  height={100}
                  wide
                />
              </Form.FieldGroup>
              <Form.FieldGroup
                label={t("projects.forms.new.layout_header")}
                instructions={this.layoutInstructions}
              >
                <Form.Radios
                  label={t("glossary.text_title_case_other")}
                  prompt={t("projects.forms.new.texts_prompt")}
                  name="attributes[configuration][multipleTexts]"
                  instructions={t("projects.forms.new.texts_instructions")}
                  options={[
                    { label: t("common.yes"), value: true },
                    { label: t("common.no"), value: false }
                  ]}
                  inline
                  wide
                />
                <Form.Radios
                  label={t("glossary.resource_title_case_other")}
                  prompt={t("projects.forms.new.resources_prompt")}
                  name="attributes[configuration][resources]"
                  instructions={t("projects.forms.new.resources_instructions")}
                  options={[
                    { label: t("common.yes"), value: true },
                    { label: t("common.no"), value: false }
                  ]}
                  inline
                  wide
                />
                <Form.Radios
                  label={t("projects.forms.new.extended_descript_label")}
                  prompt={t("projects.forms.new.extended_descript_prompt")}
                  name="attributes[configuration][markdown]"
                  instructions={t(
                    "projects.forms.new.extended_descript_instructions"
                  )}
                  options={[
                    { label: t("common.yes"), value: true },
                    { label: t("common.no"), value: false }
                  ]}
                  inline
                  wide
                />
                <Form.Radios
                  label={t("projects.activity")}
                  prompt={t("projects.forms.new.activity_prompt")}
                  name="attributes[configuration][recentActivity]"
                  instructions={t("projects.forms.new.activity_instructions")}
                  options={[
                    { label: t("common.yes"), value: true },
                    { label: t("common.no"), value: false }
                  ]}
                  inline
                  wide
                />
              </Form.FieldGroup>
              <Form.Save
                text={t("projects.forms.new.save")}
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
