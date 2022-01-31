import React, { PureComponent } from "react";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import PropTypes from "prop-types";
import Authorize from "hoc/Authorize";
import Layout from "backend/components/layout";
import Navigation from "backend/components/navigation";
import { journalsAPI } from "api";
import lh from "helpers/linkHandler";

export default class JournalsNew extends PureComponent {
  static displayName = "Journals.New";

  static propTypes = {
    history: PropTypes.object
  };

  redirectToJournal(journal) {
    const path = lh.link("backendJournal", journal.id);
    this.props.history.push(path);
  }

  handleSuccess = journal => {
    this.redirectToJournal(journal);
  };

  render() {
    return (
      <Authorize
        entity={"journal"}
        ability="create"
        failureNotification
        failureRedirect={lh.link("backend")}
      >
        <div>
          <Navigation.DetailHeader
            type="journal"
            title={"New journal"}
            showUtility={false}
            note={
              "Enter the name of your journal, and a brief description. Press save to continue."
            }
          />
          <Layout.BackendPanel>
            <FormContainer.Form
              name="backend-create-journal"
              update={journalsAPI.update}
              create={journalsAPI.create}
              onSuccess={this.handleSuccess}
              className="form-secondary"
            >
              <Form.FieldGroup label="Title and Description">
                <Form.TextInput
                  validation={["required"]}
                  focusOnMount
                  label="Title"
                  name="attributes[title]"
                  placeholder="Enter Journal Title"
                />
                <Form.TextInput
                  label="Subtitle"
                  name="attributes[subtitle]"
                  placeholder="Enter Journal Subtitle"
                />
                <Form.TextArea
                  label="Brief Description"
                  name="attributes[description]"
                  height={100}
                  wide
                />
              </Form.FieldGroup>
              <Form.Save
                text="Save and Continue"
                cancelRoute={lh.link("backendJournals")}
              />
            </FormContainer.Form>
          </Layout.BackendPanel>
        </div>
      </Authorize>
    );
  }
}
