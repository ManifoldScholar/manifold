import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import { pagesAPI } from "api";
import connectAndFetch from "utils/connectAndFetch";

class PagesGeneralContainer extends PureComponent {
  static displayName = "Content.Pages.General";

  static propTypes = {
    page: PropTypes.object.isRequired,
    onSuccess: PropTypes.func
  };

  render() {
    if (!this.props.page) return null;
    const { page } = this.props;

    return (
      <section>
        <FormContainer.Form
          model={page}
          onSuccess={this.props.onSuccess}
          name="backend-page-update"
          update={pagesAPI.update}
          create={pagesAPI.create}
          className="form-secondary"
        >
          <Form.TextInput
            validation={["required"]}
            focusOnMount
            label="Page Title"
            name="attributes[title]"
            placeholder="Enter Page Title"
          />
          <Form.FieldGroup
            horizontal
            label="Page States"
            instructions="Manage visibility and whether or not the page appears in navigation"
          >
            <Form.Switch
              className="form-input-fourth"
              label="Hide Page"
              labelClass="secondary"
              labelPos="below"
              name="attributes[hidden]"
            />
            <Form.Switch
              className="form-input-fourth"
              label="Show in Footer"
              labelClass="secondary"
              labelPos="below"
              name="attributes[showInFooter]"
            />
            <Form.Switch
              className="form-input-fourth"
              label="Show in Header"
              labelClass="secondary"
              labelPos="below"
              name="attributes[showInHeader]"
            />
          </Form.FieldGroup>
          <Form.TextInput
            validation={["required"]}
            label="Slug"
            name="attributes[slug]"
            placeholder="Enter URL Slug"
            instructions="The page URL is based on the slug."
          />
          <Form.TextInput
            label="Navigation Title"
            name="attributes[navTitle]"
            placeholder="Alternate Navigation Title"
            instructions="If set, this title will be used in header and footer navigation"
          />
          <Form.Save text="Save Page" />
        </FormContainer.Form>
      </section>
    );
  }
}

export default connectAndFetch(PagesGeneralContainer);
