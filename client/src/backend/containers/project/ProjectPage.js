import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { projectsAPI } from "api";
import lh from "helpers/linkHandler";

// Not localized for v7. Not currently used in route-containers. -LD

import Authorize from "hoc/Authorize";

export default class ProjectProjectPageContainer extends PureComponent {
  static displayName = "Project.ProjectPage";

  static propTypes = {
    project: PropTypes.object
  };

  render() {
    const project = this.props.project;

    return (
      <Authorize
        entity={project}
        ability="update"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <section>
          <FormContainer.Form
            model={project}
            name="backend-project-update"
            update={projectsAPI.update}
            create={projectsAPI.create}
            className="form-secondary"
          >
            <Form.FieldGroup label="Appearance">
              <Form.Switch
                wide
                label="Hide Project Activity"
                name="attributes[hideActivity]"
                instructions="If set, project activity will not be shown on the project page."
              />
              <Form.TextArea
                wide
                label="Description"
                name="attributes[description]"
                instructions="Enter a brief description of your project. This field accepts basic Markdown."
              />
              <Form.Upload
                layout="landscape"
                accepts="images"
                label="Hero Image"
                readFrom="attributes[heroStyles][small]"
                name="attributes[hero]"
                remove="attributes[removeHero]"
                instructions={
                  "The Hero Image is displayed at the top of the project landing page. Images will be resized to 1280x800 and cropped along the bottom edge."
                }
              />
              <Form.Upload
                layout="portrait"
                label="Cover"
                accepts="images"
                readFrom="attributes[coverStyles][small]"
                name="attributes[cover]"
                remove="attributes[removeCover]"
                instructions="If a cover is set for the project, it will appear over the hero, to the right of the description on the landing page."
              />
            </Form.FieldGroup>
            <Form.FieldGroup label="Purchase Options">
              <Form.TextInput
                wide
                label="Purchase URL"
                name="attributes[purchaseUrl]"
                placeholder="Enter Purchase URL"
                instructions="A URL where users can purchase the published edition"
              />
              <Form.TextInput
                wide
                label="Purchase Call To Action"
                name="attributes[purchaseCallToAction]"
                placeholder="Buy Print Version"
                instructions="If set, this text will appear in the buy button on the project page"
              />
              <Form.MaskedTextInput
                label="Purchase Price"
                name="attributes[purchasePriceMoney]"
                mask="currency"
                instructions="The cost of the published edition"
              />
              <Form.TextInput
                label="Currency"
                name="attributes[purchasePriceCurrency]"
                placeholder="Enter Purchase Price Currency Code"
                instructions="For example, USD for US Dollars"
              />
            </Form.FieldGroup>
            <Form.FieldGroup
              label="Download Options"
              instructions="If a URL or file is provided, a button to download the file will appear on the project page.  A file takes precedence over a URL."
            >
              <Form.TextInput
                wide
                label="Download URL"
                name="attributes[downloadUrl]"
                placeholder="Enter Download URL"
              />
              <Form.TextInput
                wide
                label="Download Call To Action"
                name="attributes[downloadCallToAction]"
                placeholder="Download eBook"
                instructions="If set, this text will appear in the download link on the project page"
              />
            </Form.FieldGroup>
            <Form.Save text="Save Project" />
          </FormContainer.Form>
        </section>
      </Authorize>
    );
  }
}
