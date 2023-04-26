import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { subjectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";

export class SettingsSubjectsNewContainer extends PureComponent {
  static displayName = "Settings.Subjects.New";

  static propTypes = {
    history: PropTypes.object,
    subject: PropTypes.object,
    t: PropTypes.func
  };

  handleSuccess = () => {
    const path = lh.link("backendSettingsSubjects");
    this.props.history.push(path);
  };

  render() {
    const t = this.props.t;
    return (
      <section>
        <Layout.DrawerHeader title={t("settings.subjects.new_header")} />
        <FormContainer.Form
          model={this.props.subject}
          name="backend-create-subject"
          update={subjectsAPI.update}
          create={subjectsAPI.create}
          options={{ adds: requests.beSubjects }}
          onSuccess={this.handleSuccess}
          className="form-secondary"
        >
          <Form.TextInput
            validation={["required"]}
            focusOnMount
            label={t("settings.subjects.name_label")}
            name="attributes[name]"
            placeholder={t("settings.subjects.name_placeholder")}
          />
          <Form.Save
            text={t("settings.subjects.new_save")}
            cancelRoute={lh.link("backendSettingsSubjects")}
          />
        </FormContainer.Form>
      </section>
    );
  }
}

export default withTranslation()(connectAndFetch(SettingsSubjectsNewContainer));
