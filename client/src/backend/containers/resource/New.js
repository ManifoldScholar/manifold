import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import FormContainer from "global/containers/form";
import Layout from "backend/components/layout";
import Form from "global/components/form";
import PageHeader from "backend/components/layout/PageHeader";
import Resource from "backend/components/resource";
import GlobalForm from "global/components/form";
import { requests, projectsAPI, resourcesAPI } from "api";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { getBreadcrumbs } from "./breadcrumbs";

import Authorize from "hoc/Authorize";

const { request } = entityStoreActions;

export class ResourceNewContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      project: select(requests.beProject, state.entityStore)
    };
  };

  static fetchData = (getState, dispatch, location, match) => {
    const promises = [];
    const projectCall = projectsAPI.show(match.params.projectId);
    const { promise: one } = dispatch(request(projectCall, requests.beProject));
    promises.push(one);
    return Promise.all(promises);
  };

  static displayName = "Resource.New";

  static propTypes = {
    project: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.defaultResource = { attributes: { kind: "image" } };
  }

  redirectToResource(resource) {
    const path = lh.link("backendResource", resource.id);
    this.props.history.push(path);
  }

  handleSuccess = resource => {
    this.redirectToResource(resource);
  };

  render() {
    const { project, t } = this.props;
    if (!project) return null;

    const belongsToJournalIssue = project.attributes.isJournalIssue;

    const breadcrumbs = getBreadcrumbs(null, project, belongsToJournalIssue, t);

    const parentProps = {
      parentTitle: project.attributes.titleFormatted,
      parentSubtitle: project.attributes.subtitle,
      parentId: project.id
    };

    return (
      <Authorize
        entity={project}
        ability={"createResources"}
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <HeadContent
          title={`${t(`titles.resource_new`)} | ${t("common.admin")}`}
          appendDefaultTitle
        />
        <div>
          <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
          <PageHeader
            type="resource"
            backUrl={lh.link("backendProjectResources", project.id)}
            backLabel={project.attributes.titlePlaintext}
            title={t("resources.new.title")}
            note={t("resources.new.instructions")}
            icon="BEResourcesBox64"
            {...parentProps}
          />
          <Layout.BackendPanel>
            <FormContainer.Form
              model={this.defaultResource}
              name="backend-resource-create"
              update={resourcesAPI.update}
              create={model => resourcesAPI.create(project.id, model)}
              onSuccess={this.handleSuccess}
              className="form-secondary"
            >
              <Resource.Form.KindPicker
                name="attributes[kind]"
                includeButtons
              />
              <Form.TextInput
                label={t("resources.title_label")}
                name="attributes[title]"
                placeholder={t("resources.title_placeholder")}
                wide
              />
              <Form.TextArea
                label={t("resources.descript_label")}
                name="attributes[description]"
                placeholder={t("resources.descript_placeholder")}
                wide
              />
              <Resource.Form.KindAttributes />
              <GlobalForm.Errorable name="attributes[fingerprint]" />
              <Form.Save
                text={t("resources.new.save")}
                cancelRoute={lh.link("backendProjectResources", project.id)}
              />
            </FormContainer.Form>
          </Layout.BackendPanel>
        </div>
      </Authorize>
    );
  }
}

export default withTranslation()(connectAndFetch(ResourceNewContainer));
