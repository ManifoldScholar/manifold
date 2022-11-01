import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { pagesAPI } from "api";
import { select } from "utils/entityUtils";
import connectAndFetch from "utils/connectAndFetch";

import withFormSession from "hoc/withFormSession";

class PagesPropertiesContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      page: select("backend-page", state.entityStore)
    };
  };

  static displayName = "Pages.Properties";

  static propTypes = {
    page: PropTypes.object.isRequired,
    onSuccess: PropTypes.func,
    form: PropTypes.object,
    t: PropTypes.func
  };

  renderPath() {
    const isExternal = this.props.form.getModelValue(
      "attributes[isExternalLink]"
    );
    const t = this.props.t;
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
        wide
        validation={["required"]}
        label={t("backend.forms.page.slug_label")}
        name="attributes[pendingSlug]"
        placeholder={t("backend.forms.page.slug_placeholder")}
        instructions={t("backend.forms.page.slug_instructions")}
      />
    );
  }

  renderBody() {
    const isExternal = this.props.form.getModelValue(
      "attributes[isExternalLink]"
    );
    if (isExternal) return null;
    const t = this.props.t;
    return (
      <Form.TextArea
        wide
        label={t("backend.forms.page.body_label")}
        height={300}
        name="attributes[body]"
        placeholder={t("backend.forms.page.body_placeholder")}
        instructions={t("backend.forms.page.body_instructions")}
      />
    );
  }

  renderNewTab() {
    const purpose = this.props.form.getModelValue("attributes[purpose]");
    if (purpose === "terms_and_conditions") return null;
    const t = this.props.t;

    return (
      <Form.Switch
        wide
        label={t("backend.forms.page.new_tab_label")}
        name="attributes[openInNewTab]"
      />
    );
  }

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
          <Form.FieldGroup label={t("backend.forms.page.properties_label")}>
            <Form.TextInput
              wide
              validation={["required"]}
              focusOnMount
              label={t("backend.forms.page.title_label")}
              name="attributes[title]"
              placeholder={t("backend.forms.page.title_placeholder")}
            />
            <Form.TextInput
              wide
              label={t("backend.forms.page.navigation_label")}
              name="attributes[navTitle]"
              placeholder={t("backend.forms.page.navigation_placeholder")}
              instructions={t("backend.forms.page.navigation_instructions")}
            />
            <Form.Select
              label={t("backend.forms.page.purpose_label")}
              name="attributes[purpose]"
              options={[
                {
                  label: t("backend.forms.page.purpose_options.supplemental"),
                  value: "supplemental_content"
                },
                {
                  label: t("backend.forms.page.purpose_options.privacy_policy"),
                  value: "privacy_policy"
                },
                {
                  label: t("backend.forms.page.purpose_options.terms"),
                  value: "terms_and_conditions"
                }
              ]}
            />
            <Form.Switch
              wide
              label={t("backend.forms.page.switch_label")}
              name="attributes[isExternalLink]"
            />
            {this.renderNewTab()}
            {this.renderPath()}
            {this.renderBody()}
          </Form.FieldGroup>
          <Form.FieldGroup
            label={t("backend.forms.page.states_label")}
            instructions={t("backend.forms.page.states_instructions")}
          >
            <Form.Switch
              className="fourth"
              label={t("backend.forms.page.states_options.hide")}
              labelPos="below"
              name="attributes[hidden]"
              isPrimary
            />
            <Form.Switch
              className="fourth"
              label={t("backend.forms.page.states_options.footer")}
              labelPos="below"
              name="attributes[showInFooter]"
              isPrimary
            />
            <Form.Switch
              className="fourth"
              label={t("backend.forms.page.states_options.header")}
              labelPos="below"
              name="attributes[showInHeader]"
              isPrimary
            />
          </Form.FieldGroup>
          <Form.Save text={t("backend.forms.page.submit_label")} />
        </FormContainer.Form>
      </section>
    );
  }
}

export default withFormSession(
  withTranslation()(connectAndFetch(PagesPropertiesContainer)),
  "backend-page-update"
);
