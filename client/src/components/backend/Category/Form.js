import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { textCategoriesAPI } from 'api';

export default class CategoryForm extends PureComponent {

  static displayName = "Category.Form";

  static propTypes = {};

  render() {

    return (
      <FormContainer.Form
        {...this.props}
        name="backend-edit-user"
        update={textCategoriesAPI.update}
        create={(model) => textCategoriesAPI.create(this.props.projectId, model) }
        className="form-secondary"
      >
        <Form.TextInput
          label="Title"
          name="attributes[title]"
          placeholder="What would you like to call this category?"
        />
        <Form.Save
          text={this.props.model ? "Update Category" : "Create Category" }
        />
      </FormContainer.Form>
    );
  }

}
