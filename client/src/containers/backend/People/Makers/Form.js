import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import { makersAPI, requests } from "api";

export default class MakersFormContainer extends PureComponent {
  static displayName = "Makers.Form";

  static propTypes = {
    maker: PropTypes.object,
    successHandler: PropTypes.func,
    options: PropTypes.object
  };

  handleSuccess = maker => {
    if (!this.props.successHandler) return null;
    return this.props.successHandler(maker);
  };

  render() {
    const maker = this.props.maker;
    const requestName = maker ? requests.beMakerUpdate : requests.beMakerCreate;

    return (
      <section className="form-section">
        <FormContainer.Form
          model={maker}
          name={requestName}
          update={makersAPI.update}
          create={makersAPI.create}
          onSuccess={this.handleSuccess}
          options={this.props.options}
          className="form-secondary"
          notificationScope="drawer"
        >
          <Form.TextInput
            label="First Name"
            name="attributes[firstName]"
            placeholder="First Name"
            focusOnMount
          />
          <Form.TextInput
            label="Middle Name"
            name="attributes[middleName]"
            placeholder="Middle Name"
          />
          <Form.TextInput
            label="Last Name"
            name="attributes[lastName]"
            placeholder="Last Name"
          />
          <Form.TextInput
            label="Suffix"
            name="attributes[suffix]"
            placeholder="Suffix"
          />
          <Form.Upload
            layout="square"
            accepts="images"
            label="Avatar Image"
            readFrom="attributes[avatarStyles][smallSquare]"
            name="attributes[avatar]"
            remove="attributes[removeAvatar]"
          />
          <Form.Save text="Save Maker" />
        </FormContainer.Form>
      </section>
    );
  }
}
