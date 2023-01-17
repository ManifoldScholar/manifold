import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { pagesAPI } from "api";
import connectAndFetch from "utils/connectAndFetch";

class PagesEditContainer extends PureComponent {
  static displayName = "Pages.Body";

  static propTypes = {
    page: PropTypes.object.isRequired,
    onSuccess: PropTypes.func,
    t: PropTypes.func
  };

  render() {
    if (!this.props.page) return null;
    const { page, t } = this.props;

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
            label={t("records.pages.body_label")}
            height={300}
            name="attributes[body]"
            placeholder={t("records.pages.body_placeholder")}
            instructions={t("records.pages.body_instructions")}
          />
          <Form.Save text={t("records.pages.submit_label")} />
        </FormContainer.Form>
      </section>
    );
  }
}

export default withTranslation()(connectAndFetch(PagesEditContainer));
