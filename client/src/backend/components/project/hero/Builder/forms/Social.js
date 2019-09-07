import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { projectsAPI } from "api";
import Authorize from "hoc/authorize";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";

export default class Social extends PureComponent {
  static displayName = "Project.Hero.Builder.Forms.Social";

  static propTypes = {
    project: PropTypes.object.isRequired,
    closeDrawer: PropTypes.func
  };

  get project() {
    return this.props.project;
  }

  closeDrawer = () => {
    if (!this.props.closeDrawer) return;
    this.props.closeDrawer();
  };

  render() {
    return (
      <Authorize
        entity={this.project}
        ability="update"
        failureNotification
        failureRedirect={lh.link("backendProject", this.project.id)}
      >
        <section>
          <Navigation.DrawerHeader icon="projects64" title="Social Links" />
          <FormContainer.Form
            model={this.project}
            name="backend-project-update"
            update={projectsAPI.update}
            create={projectsAPI.create}
            onSuccess={this.closeDrawer}
            className="form-secondary"
          >
            <Form.MaskedTextInput
              label="Hashtag"
              name="attributes[hashtag]"
              mask="hashtag"
              placeholder="Enter Project Hashtag"
            />
            <Form.TextInput
              label="Facebook ID"
              name="attributes[facebookId]"
              placeholder="Enter Project Facebook ID"
            />
            <Form.TextInput
              label="Twitter ID"
              name="attributes[twitterId]"
              placeholder="Enter Project Twitter ID"
            />
            <Form.TextInput
              label="Instagram ID"
              name="attributes[instagramId]"
              placeholder="Enter Project Instagram ID"
            />
            <Form.Save text="Save" />
          </FormContainer.Form>
        </section>
      </Authorize>
    );
  }
}
