import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import { pagesAPI } from "api";
import connectAndFetch from "utils/connectAndFetch";

class PagesEditContainer extends PureComponent {
  static displayName = "Pages.Body";

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
          <Form.TextArea
            label="Body"
            height={300}
            name="attributes[body]"
            placeholder="Enter Body Content"
            instructions="You may use basic markdown in this field to format your content."
          />
          <Form.Save text="Save Page" />
        </FormContainer.Form>
      </section>
    );
  }
}

export default connectAndFetch(PagesEditContainer);
