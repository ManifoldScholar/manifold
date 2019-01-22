import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "backend/components/form";
import FormContainer from "backend/containers/form";
import { textCategoriesAPI, requests } from "api";

export default class CategoryForm extends PureComponent {
  static displayName = "Category.Form";

  static propTypes = {
    projectId: PropTypes.string,
    model: PropTypes.object
  };

  render() {
    const name = this.props.model
      ? requests.beTextCategoryUpdate
      : requests.beTextCategoryCreate;

    return (
      <FormContainer.Form
        {...this.props}
        name={name}
        update={textCategoriesAPI.update}
        create={model => textCategoriesAPI.create(this.props.projectId, model)}
        className="form-secondary"
        notificationScope="none"
      >
        <Form.TextInput
          label="Title"
          focusOnMount
          name="attributes[title]"
          placeholder="What would you like to call this category?"
        />
        <Form.Save
          text={this.props.model ? "Update Category" : "Create Category"}
        />
      </FormContainer.Form>
    );
  }
}
