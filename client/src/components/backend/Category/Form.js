import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { textCategoriesAPI } from 'api';

export default class CategoryForm extends PureComponent {

  static displayName = "Category.Form";

  static propTypes = {
    projectId: PropTypes.string
  };

  render() {

    return (
      <FormContainer.Form
        {...this.props}
        name="backend-category-update"
        update={textCategoriesAPI.update}
        create={(model) => textCategoriesAPI.create(this.props.projectId, model) }
        className="form-secondary"
      >
        <Form.TextInput
          label="Title"
          focusOnMount
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
