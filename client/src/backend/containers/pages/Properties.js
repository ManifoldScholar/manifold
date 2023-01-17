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
          label={t("records.pages.external_label")}
          name="attributes[externalLink]"
          placeholder={t("records.pages.external_placeholder")}
          instructions={t("records.pages.external_instructions")}
        />
      );
    return (
      <Form.TextInput
        wide
        validation={["required"]}
        label={t("records.pages.slug_label")}
        name="attributes[pendingSlug]"
        placeholder={t("records.pages.slug_placeholder")}
        instructions={t("records.pages.slug_instructions")}
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
        label={t("records.pages.body_label")}
        height={300}
        name="attributes[body]"
        placeholder={t("records.pages.body_placeholder")}
        instructions={t("records.pages.body_instructions")}
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
        label={t("records.pages.new_tab_label")}
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
          <Form.FieldGroup label={t("records.pages.properties_label")}>
            <Form.TextInput
              wide
              validation={["required"]}
              focusOnMount
              label={t("records.pages.title_label")}
              name="attributes[title]"
              placeholder={t("records.pages.title_placeholder")}
            />
            <Form.TextInput
              wide
              label={t("records.pages.navigation_label")}
              name="attributes[navTitle]"
              placeholder={t("records.pages.navigation_placeholder")}
              instructions={t("records.pages.navigation_instructions")}
            />
            <Form.Select
              label={t("records.pages.purpose_label")}
              name="attributes[purpose]"
              options={[
                {
                  label: t("records.pages.purpose_options.supplemental"),
                  value: "supplemental_content"
                },
                {
                  label: t("records.pages.purpose_options.privacy_policy"),
                  value: "privacy_policy"
                },
                {
                  label: t("records.pages.purpose_options.terms"),
                  value: "terms_and_conditions"
                }
              ]}
            />
            <Form.Switch
              wide
              label={t("records.pages.switch_label")}
              name="attributes[isExternalLink]"
            />
            {this.renderNewTab()}
            {this.renderPath()}
            {this.renderBody()}
          </Form.FieldGroup>
          <Form.FieldGroup
            label={t("records.pages.states_label")}
            instructions={t("records.pages.states_instructions")}
          >
            <Form.Switch
              className="fourth"
              label={t("records.pages.states_options.hide")}
              labelPos="below"
              name="attributes[hidden]"
              isPrimary
            />
            <Form.Switch
              className="fourth"
              label={t("records.pages.states_options.footer")}
              labelPos="below"
              name="attributes[showInFooter]"
              isPrimary
            />
            <Form.Switch
              className="fourth"
              label={t("records.pages.states_options.header")}
              labelPos="below"
              name="attributes[showInHeader]"
              isPrimary
            />
          </Form.FieldGroup>
          <Form.Save text={t("records.pages.submit_label")} />
        </FormContainer.Form>
      </section>
    );
  }
}

export default withFormSession(
  withTranslation()(connectAndFetch(PagesPropertiesContainer)),
  "backend-page-update"
);
