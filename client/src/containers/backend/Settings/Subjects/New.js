import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Navigation } from "components/backend";
import { Form } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import { subjectsAPI } from "api";
import lh from "helpers/linkHandler";

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
      <div>
        <Navigation.DetailHeader
          type="subject"
          breadcrumb={[
            { path: lh.link("backendSettingsSubjects"), label: "ALL SUBJECTS" }
          ]}
          title={"New Subject"}
          showUtility={false}
          note={"Enter the name of your subject. Press save to continue."}
        />
        <section className="backend-panel">
          <div className="container">
            <div className="panel">
              <section>
                <FormContainer.Form
                  model={this.props.subject}
                  name="backend-create-subject"
                  update={subjectsAPI.update}
                  create={subjectsAPI.create}
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
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connectAndFetch(SettingsSubjectsNewContainer);
