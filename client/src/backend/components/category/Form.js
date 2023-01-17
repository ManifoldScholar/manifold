import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { textCategoriesAPI, requests } from "api";
import { withTranslation } from "react-i18next";

class CategoryForm extends PureComponent {
  static displayName = "Category.Form";

  static propTypes = {
    projectId: PropTypes.string,
    model: PropTypes.object,
    t: PropTypes.func
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
          label={this.props.t("glossary.title_title_case_one")}
          focusOnMount
          name="attributes[title]"
          placeholder={this.props.t("projects.category.title_placeholder")}
        />
        <Form.Save
          text={
            this.props.model
              ? this.props.t("projects.category.update")
              : this.props.t("projects.category.create")
          }
        />
      </FormContainer.Form>
    );
  }
}

export default withTranslation()(CategoryForm);
