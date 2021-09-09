import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { projectsAPI } from "api";
import Authorize from "hoc/authorize";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";

export default class Description extends PureComponent {
  static displayName = "Project.Hero.Builder.Forms.Description";

  static propTypes = {
    project: PropTypes.object.isRequired,
    closeDrawer: PropTypes.func,
    headerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
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
          <Navigation.DrawerHeader
            icon="projects64"
            title="Description + Images"
            headerId={this.props.headerId}
          />
          <FormContainer.Form
            model={this.project}
            name="backend-project-update"
            update={projectsAPI.update}
            create={projectsAPI.create}
            className="form-secondary"
            onSuccess={this.closeDrawer}
          >
            <Form.Switch label="Dark Mode" name="attributes[darkMode]" />
            <Form.TextArea
              wide
              focusOnMount
              height={250}
              label="Description"
              name="attributes[description]"
              placeholder="Describe the project"
              instructions="Enter a brief description of your project. This field accepts basic Markdown."
            />
            <Form.Upload
              layout="landscape"
              accepts="images"
              label="Background Image"
              readFrom="attributes[heroStyles][small]"
              name="attributes[hero]"
              remove="attributes[removeHero]"
              instructions={
                "Images will be resized to 1280x800 and cropped along the bottom edge."
              }
            />
            <Form.Upload
              layout="portrait"
              label="Cover Image"
              accepts="images"
              readFrom="attributes[coverStyles][small]"
              name="attributes[cover]"
              remove="attributes[removeCover]"
              instructions="If a cover is set for the project, it will appear over the hero, to the right of the description."
            />
            <Form.TextArea
              label="Image Credits"
              name="attributes[imageCredits]"
              placeholder="Add image credits"
              instructions="Enter image credits for hero and cover. This field accepts basic Markdown."
              height={250}
              wide
            />
            <Form.Save text="Save" />
          </FormContainer.Form>
        </section>
      </Authorize>
    );
  }
}
