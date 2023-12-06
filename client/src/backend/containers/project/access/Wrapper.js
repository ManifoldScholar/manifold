import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import PermissionsContainer from "backend/containers/permission";
import EntitlementsContainer from "backend/containers/entitlements";
import Authorize from "hoc/Authorize";
import Authorization from "helpers/authorization";
import Layout from "backend/components/layout";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import Hero from "backend/components/hero";
import withSettings from "hoc/withSettings";
import connectAndFetch from "utils/connectAndFetch";

class ProjectAccessWrapper extends Component {
  static mapStateToProps = state => {
    return {
      authentication: state.authentication
    };
  };

  static displayName = "Project.Access.Wrapper";

  static propTypes = {
    project: PropTypes.object,
    route: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
    authentication: PropTypes.object,
    t: PropTypes.func
  };

  get defaultIsRestricted() {
    return this.props.settings.attributes.general.restrictedAccess === true;
  }

  get defaultIsOpen() {
    return !this.defaultIsRestricted;
  }

  render() {
    const { project, updateProject, t, authentication } = this.props;
    if (!project) return null;

    const authorization = new Authorization();

    const canGrantPermissions = authorization.authorizeAbility({
      authentication,
      entity: project,
      ability: "managePermissions"
    });

    const closeUrl = lh.link("backendProjectAccess", project.id);
    return (
      <>
        <Authorize
          entity={project}
          ability="update"
          failureNotification
          failureRedirect={lh.link("backendProject", project.id)}
        >
          {canGrantPermissions && (
            <Layout.BackendPanel flush>
              <PermissionsContainer.List entity={project} />
            </Layout.BackendPanel>
          )}
          <Layout.BackendPanel flush={!canGrantPermissions}>
            <EntitlementsContainer.List
              entity={project}
              preList={
                <div style={{ marginBottom: 44, marginTop: 22 }}>
                  <Hero.Block
                    title={t("projects.forms.access.title")}
                    description={t("projects.forms.access.description")}
                    initialVisible={this.defaultIsRestricted}
                  >
                    <FormContainer.Form
                      style={{ paddingTop: 24, paddingBottom: 24 }}
                      model={project}
                      name="backend-project-update"
                      update={updateProject}
                      className="form-secondary"
                    >
                      {this.defaultIsOpen && (
                        <Form.Switch
                          label={t("projects.forms.access.restricted_label")}
                          name="attributes[restrictedAccess]"
                          wide
                        />
                      )}
                      {this.defaultIsRestricted && (
                        <Form.Switch
                          label={t("projects.forms.access.open_access_label")}
                          name="attributes[openAccess]"
                          wide
                        />
                      )}
                      <Form.TextInput
                        label={t("projects.forms.access.notice_header_label")}
                        name="attributes[restrictedAccessHeading]"
                        placeholder={t(
                          "projects.forms.access.notice_header_placeholder"
                        )}
                        wide
                      />
                      <Form.TextArea
                        label={t("projects.forms.access.notice_body_label")}
                        name="attributes[restrictedAccessBody]"
                        placeholder={t(
                          "projects.forms.access.notice_body_placeholder"
                        )}
                      />
                      <Form.Save text={t("projects.forms.access.save")} />
                    </FormContainer.Form>
                  </Hero.Block>
                </div>
              }
            />
          </Layout.BackendPanel>
        </Authorize>
        {childRoutes(this.props.route, {
          drawer: true,
          drawerProps: { closeUrl, lockScroll: "always" },
          childProps: {
            entity: project,
            closeUrl,
            history: this.props.history
          }
        })}
      </>
    );
  }
}

export default withTranslation()(
  withSettings(connectAndFetch(ProjectAccessWrapper))
);
