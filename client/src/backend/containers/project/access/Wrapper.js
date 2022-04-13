import React, { Component } from "react";
import PropTypes from "prop-types";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import PermissionsContainer from "backend/containers/permission";
import EntitlementsContainer from "backend/containers/entitlements";
import Authorize from "hoc/Authorize";
import Layout from "backend/components/layout";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import config from "config";
import Hero from "backend/components/hero";
import withSettings from "hoc/withSettings";

class ProjectAccessWrapper extends Component {
  static displayName = "Project.Access.Wrapper";

  static propTypes = {
    project: PropTypes.object,
    route: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object
  };

  get defaultIsRestricted() {
    return this.props.settings.attributes.general.restrictedAccess === true;
  }

  // This didn't seem to be in use, but can add                 initialVisible={this.defaultIsOpen} as a prop on `Hero.Block` if this is the expected behavior. -LD
  get defaultIsOpen() {
    return !this.defaultIsRestricted;
  }

  render() {
    const { project, updateProject } = this.props;
    if (!project) return null;

    const closeUrl = lh.link("backendProjectAccess", project.id);
    return (
      <>
        <Authorize
          entity={project}
          ability="update"
          failureNotification
          failureRedirect={lh.link("backendProject", project.id)}
        >
          <Layout.BackendPanel flush>
            <PermissionsContainer.List entity={project} />
          </Layout.BackendPanel>
          <Layout.BackendPanel>
            <EntitlementsContainer.List
              entity={project}
              preList={
                <div style={{ marginBottom: 44, marginTop: 22 }}>
                  <Hero.Block
                    title="Configure Access Restrictions"
                    description="Enable access restrictions and adjust messaging"
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
                          className="form-toggle-secondary"
                          label="Project Access is Restricted"
                          name="attributes[restrictedAccess]"
                        />
                      )}
                      {this.defaultIsRestricted && (
                        <Form.Switch
                          className="form-toggle-secondary"
                          label="Project is Open Access"
                          name="attributes[openAccess]"
                        />
                      )}
                      <Form.TextInput
                        className="form-toggle-secondary"
                        label="Restricted Access Notice Header"
                        name="attributes[restrictedAccessHeading]"
                        placeholder={
                          config.app.locale.notifications
                            .projectAuthorizationNotice.heading
                        }
                      />
                      <Form.TextArea
                        className="form-toggle-secondary"
                        label="Restricted Access Notice Body"
                        name="attributes[restrictedAccessBody]"
                        placeholder={
                          config.app.locale.notifications
                            .projectAuthorizationNotice.body
                        }
                      />
                      <Form.Save text="Update Access Settings" />
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

export default withSettings(ProjectAccessWrapper);
