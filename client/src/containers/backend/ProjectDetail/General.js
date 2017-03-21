import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import update from 'immutability-helper';
import set from 'lodash/set';
import { projectsAPI } from 'api';

export default class ProjectPanelGeneral extends PureComponent {

  static displayName = "ProjectDetail.General";
  static activeNavItem = "general";

  static propTypes = {
    route: PropTypes.object,
    project: PropTypes.object,
    dispatch: PropTypes.func,
    editSession: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    // See https://github.com/ReactTraining/react-router/issues/3753
    return (
      <section>
        <FormContainer.Form
          route={this.props.routes[this.props.routes.length - 1]}
          model={this.props.project}
          name="backend-project-update"
          update={projectsAPI.update}
          create={projectsAPI.create}
          className="form-secondary"
        >
          <Form.TextInput
            validation={["required"]}
            focusOnMount
            label="Title"
            name="attributes[title]"
            placeholder="Enter Project Title"
          />
          <Form.TextInput
            label="Subtitle"
            name="attributes[subtitle]"
            placeholder="Enter Project Subtitle"
          />
          <Form.Date
            label="Publication Date"
            name="attributes[publicationDate]"
          />
          <Form.Switch
            label="Featured"
            name="attributes[featured]"
          />
          <Form.MaskedTextInput
            label="Hashtag"
            name="attributes[hashtag]"
            mask="hashtag"
          />
          <Form.TextArea
            label="Description"
            name="attributes[description]"
          />
          <Form.Upload
            style="square"
            label="Avatar"
            accepts="images"
            current={this.props.project.attributes.avatarStyles.smallSquare}
            name="attributes[avatar]"
            remove="attributes[removeAvatar]"
          />
          <Form.Upload
            style="portrait"
            label="Cover"
            accepts="images"
            current={this.props.project.attributes.coverStyles.smallPortrait}
            name="attributes[cover]"
            remove="attributes[removeCover]"
          />
          <Form.Upload
            style="landscape"
            accepts="images"
            label="Hero Image"
            current={this.props.project.attributes.heroStyles.mediumLandscape}
            name="attributes[hero]"
            remove="attributes[removeHero]"
          />
          <Form.TextInput
            label="Purchase URL"
            name="attributes[purchaseUrl]"
            placeholder="Enter Purchase URL"
          />
          <Form.MaskedTextInput
            label="Purchase Price"
            name="attributes[purchasePriceMoney]"
            mask="currency"
          />
          <Form.TextInput
            label="Currency"
            name="attributes[purchasePriceCurrency]"
            placeholder="Enter Purchase Price Currency Code"
          />
          <Form.TextInput
            label="Twitter Username"
            name="attributes[twitterId]"
            placeholder="Enter Twitter username"
          />
          <Form.TextInput
            label="Instagram Username"
            name="attributes[instagramId]"
            placeholder="Enter Instagram username"
          />
          <Form.Save
            text="Save Project"
          />
        </FormContainer.Form>
      </section>
    );
  }
}
