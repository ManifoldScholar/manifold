import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { subjectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";

export class SettingsSubjectsNewContainer extends PureComponent {
  static displayName = "Settings.Subjects.New";

  static propTypes = {
    history: PropTypes.object,
    subject: PropTypes.object
  };

  handleSuccess = () => {
    const path = lh.link("backendSettingsSubjects");
    this.props.history.push(path);
  };

  render() {
    return (
      <section>
        <Navigation.DrawerHeader title="New Subject" />
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
            label="Name"
            name="attributes[name]"
            placeholder="Enter Subject Name"
          />
          <Form.Save
            text="Save and Continue"
            cancelRoute={lh.link("backendSettingsSubjects")}
          />
        </FormContainer.Form>
      </section>
    );
  }
}

export default connectAndFetch(SettingsSubjectsNewContainer);
