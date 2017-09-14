import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { pagesAPI } from "api";
import { Form } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import connectAndFetch from "utils/connectAndFetch";
import lh from "helpers/linkHandler";

class PagesNewContainer extends PureComponent {
  static displayName = "Pages.New";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  redirectToPage(page) {
    const path = lh.link("backendContentPageGeneral", page.id);
    this.props.history.push(path);
  }

  handleSuccess = page => {
    this.redirectToPage(page);
  };

  render() {
    return (
      <section>
        <section>
          <FormContainer.Form
            onSuccess={this.handleSuccess}
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
              validation={["required"]}
              label="Slug"
              name="attributes[slug]"
              placeholder="Enter URL Slug"
              instructions="The page URL is based on the slug."
            />
            <Form.Save text="Save Page" />
          </FormContainer.Form>
        </section>
      </section>
    );
  }
}

export default connectAndFetch(PagesNewContainer);
