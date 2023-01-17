import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { pagesAPI } from "api";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import connectAndFetch from "utils/connectAndFetch";
import lh from "helpers/linkHandler";

import withFormSession from "hoc/withFormSession";

class PagesNewContainer extends PureComponent {
  static displayName = "Pages.New";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    form: PropTypes.object,
    t: PropTypes.func
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
    const t = this.props.t;
    const isExternal = this.props.form.getModelValue(
      "attributes[isExternalLink]"
    );
    if (isExternal)
      return (
        <Form.TextInput
          validation={["required"]}
          label={t("records.pages.external_label")}
          name="attributes[externalLink]"
          placeholder={t("records.pages.external_placeholder")}
          instructions={t("records.pages.external_instructions")}
        />
      );
    return (
      <Form.TextInput
        validation={["required"]}
        label={t("records.pages.slug_label")}
        name="attributes[slug]"
        placeholder={t("records.pages.slug_placeholder")}
        instructions={t("records.pages.slug_instructions")}
      />
    );
  }

  render() {
    const t = this.props.t;
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
              label={t("records.pages.title_label")}
              name="attributes[title]"
              placeholder={t("records.pages.title_placeholder")}
            />
            <Form.Switch
              label={t("records.pages.switch_label")}
              name="attributes[isExternalLink]"
            />
            {this.renderPath()}
            <Form.Save text={t("records.pages.submit_label")} />
          </FormContainer.Form>
        </section>
      </section>
    );
  }
}

export default withFormSession(
  withTranslation()(connectAndFetch(PagesNewContainer)),
  "backend-page-create"
);
