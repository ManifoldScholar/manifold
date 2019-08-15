import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { subjectsAPI, requests } from "api";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";
import withConfirmation from "hoc/with-confirmation";

const { request, flush } = entityStoreActions;

export class SettingsSubjectsEditContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      subject: select(requests.beSubject, state.entityStore)
    };
  };

  static displayName = "Settings.Subjects.Edit";

  static propTypes = {
    match: PropTypes.object,
    dispatch: PropTypes.func,
    subject: PropTypes.object,
    history: PropTypes.object,
    confirm: PropTypes.func.isRequired
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  componentDidMount() {
    this.fetchSubject(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchSubject(this.props.match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush([requests.beSubject, requests.beSubjectUpdate]));
  }

  fetchSubject = id => {
    const call = subjectsAPI.show(id);
    const subjectRequest = request(call, requests.beSubject);
    this.props.dispatch(subjectRequest);
  };

  handleSubjectDestroy = () => {
    const heading = "Are you sure you want to delete this subject?";
    const message = "This action cannot be undone.";
    this.props.confirm(heading, message, this.destroySubject);
  };

  destroySubject = () => {
    const subject = this.props.subject;
    const call = subjectsAPI.destroy(subject.id);
    const options = { removes: subject };
    const subjectRequest = request(call, requests.beSubjectDestroy, options);
    this.props.dispatch(subjectRequest).promise.then(() => {
      this.props.history.push(lh.link("backendSettingsSubjects"));
    });
  };

  render() {
    const subject = this.props.subject;
    if (!subject) return null;
    const attr = subject.attributes;
    return (
      <div>
        <Navigation.DrawerHeader
          title={attr.name}
          buttons={[
            {
              onClick: this.handleSubjectDestroy,
              icon: "delete32",
              label: "Delete",
              iconClass: "utility-button__icon--notice"
            }
          ]}
        />
        <section className="form-section">
          <FormContainer.Form
            model={subject}
            name="backend-edit-subject"
            update={subjectsAPI.update}
            create={subjectsAPI.create}
            className="form-secondary"
          >
            <Form.TextInput
              label="Name"
              name="attributes[name]"
              placeholder="Name"
            />
            <Form.Save text="Save Subject" />
          </FormContainer.Form>
        </section>
      </div>
    );
  }
}

export default withConfirmation(connectAndFetch(SettingsSubjectsEditContainer));
