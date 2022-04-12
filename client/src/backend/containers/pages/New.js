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
          label={t("backend.forms.page.external_label")}
          name="attributes[externalLink]"
          placeholder={t("backend.forms.page.external_placeholder")}
          instructions={t("backend.forms.page.external_instructions")}
        />
      );
    return (
      <Form.TextInput
        validation={["required"]}
        label={t("backend.forms.page.slug_label")}
        name="attributes[slug]"
        placeholder={t("backend.forms.page.slug_placeholder")}
        instructions={t("backend.forms.page.slug_instructions")}
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
              label={t("backend.forms.page.title_label")}
              name="attributes[title]"
              placeholder={t("backend.forms.page.title_placeholder")}
            />
            <Form.Switch
              label={t("backend.forms.page.switch_label")}
              name="attributes[isExternalLink]"
            />
            {this.renderPath()}
            <Form.Save text={t("backend.forms.page.submit_label")} />
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
