import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import { pagesAPI } from "api";
import { select } from "utils/entityUtils";
import HigherOrder from "containers/global/HigherOrder";
import connectAndFetch from "utils/connectAndFetch";

class PagesGeneralContainer extends PureComponent {
  static displayName = "Content.Pages.General";

  static mapStateToProps = state => {
    return {
      page: select("backend-page", state.entityStore)
    };
  };

  static propTypes = {
    page: PropTypes.object.isRequired,
    onSuccess: PropTypes.func,
    form: PropTypes.object
  };

  renderPath() {
    const isExternal = this.props.form.getModelValue(
      "attributes[isExternalLink]"
    );
    if (isExternal)
      return (
        <Form.TextInput
          validation={["required"]}
          label="External URL"
          name="attributes[externalLink]"
          placeholder="Enter External URL"
          instructions="The absolute URL for the page."
        />
      );
    return (
      <Form.TextInput
        validation={["required"]}
        label="Slug"
        name="attributes[slug]"
        placeholder="Enter URL Slug"
        instructions="The page URL is based on the slug."
      />
    );
  }

  renderBody() {
    const isExternal = this.props.form.getModelValue(
      "attributes[isExternalLink]"
    );
    if (isExternal) return null;
    return (
      <Form.TextArea
        label="Body"
        height={300}
        name="attributes[body]"
        placeholder="Enter Body Content"
        instructions="You may use basic markdown in this field to format your content."
      />
    );
  }

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
          <Form.TextInput
            label="Navigation Title"
            name="attributes[navTitle]"
            placeholder="Alternate Navigation Title"
            instructions="If set, this title will be used in header and footer navigation"
          />
          <Form.Select
            label="Purpose"
            name="attributes[purpose]"
            options={[
              { label: "Supplemental Content", value: "supplemental_content" },
              { label: "Privacy Policy", value: "privacy_policy" },
              { label: "Terms and Conditions", value: "terms_and_conditions" }
            ]}
          />
          <Form.Switch
            label="External Page?"
            name="attributes[isExternalLink]"
          />
          {this.renderPath()}
          {this.renderBody()}
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
          <Form.Save text="Save Page" />
        </FormContainer.Form>
      </section>
    );
  }
}

export default HigherOrder.withFormSession(
  connectAndFetch(PagesGeneralContainer),
  "backend-page-update"
);
