import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import { projectsAPI } from "api";

export default class ProjectDetailAppearance extends PureComponent {
  static displayName = "ProjectDetail.Appearance";

  static propTypes = {
    project: PropTypes.object
  };

  render() {
    return (
      <section>
        <FormContainer.Form
          model={this.props.project}
          name="backend-project-update"
          update={projectsAPI.update}
          create={projectsAPI.create}
          className="form-secondary"
        >
          <Form.TextArea
            label="Description"
            name="attributes[description]"
            instructions="Enter a brief description of your project. This field accepts basic Markdown."
          />
          <Form.Upload
            layout="landscape"
            accepts="images"
            label="Hero Image"
            readFrom="attributes[heroStyles][mediumLandscape]"
            name="attributes[hero]"
            remove="attributes[removeHero]"
            instructions="The Hero Image is displayed at the top of the project landing page."
          />
          <Form.Upload
            layout="portrait"
            label="Cover"
            accepts="images"
            readFrom="attributes[coverStyles][smallPortrait]"
            name="attributes[cover]"
            remove="attributes[removeCover]"
            instructions="If a cover is set for the project, it will appear over the hero, to the right of the description on the landing page."
          />
          <Form.TextInput
            label="Purchase URL"
            name="attributes[purchaseUrl]"
            placeholder="Enter Purchase URL"
            instructions="A URL where users can purchase the published edition"
          />
          <Form.TextInput
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
          <Form.TextInput
            label="Twitter Username"
            name="attributes[twitterId]"
            placeholder="Enter Twitter username"
            instructions="If set, a twitter icon linked to the account will appear below the description."
          />
          <Form.TextInput
            label="Instagram Username"
            name="attributes[instagramId]"
            placeholder="Enter Instagram username"
            instructions="If set, a instagram icon linked to the account will appear below the description."
          />
          <Form.Switch
            label="Hide Project Activity"
            name="attributes[hideActivity]"
            instructions="If set, project activity will not be shown on the project page."
          />
          <Form.Save text="Save Project" />
        </FormContainer.Form>
      </section>
    );
  }
}
