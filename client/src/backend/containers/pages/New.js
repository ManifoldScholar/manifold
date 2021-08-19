import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { pagesAPI } from "api";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import connectAndFetch from "utils/connectAndFetch";
import lh from "helpers/linkHandler";

import withFormSession from "hoc/with-form-session";

class PagesNewContainer extends PureComponent {
  static displayName = "Pages.New";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    form: PropTypes.object
  };

  constructor() {
    super();
    this.defaultPage = {
      attributes: { isExternalLink: false, kind: "default" }
    };
  }

  redirectToPage(page) {
    const path = lh.link("backendRecordsPage", page.id);
    this.props.history.push(path);
  }

  handleSuccess = page => {
    this.redirectToPage(page);
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

  render() {
    return (
      <section>
        <section>
          <FormContainer.Form
            onSuccess={this.handleSuccess}
            model={this.defaultPage}
            name="backend-page-create"
            update={pagesAPI.update}
            create={pagesAPI.create}
            className="form-secondary"
          >
            <Form.TextInput
              focusOnMount
              label="Page Title"
              name="attributes[title]"
              placeholder="Enter Page Title"
            />
            <Form.Switch
              label="External Page?"
              name="attributes[isExternalLink]"
            />
            {this.renderPath()}
            <Form.Save text="Save Page" />
          </FormContainer.Form>
        </section>
      </section>
    );
  }
}

export default withFormSession(
  connectAndFetch(PagesNewContainer),
  "backend-page-create"
);
