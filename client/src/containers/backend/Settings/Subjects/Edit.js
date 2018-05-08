import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { subjectsAPI, requests } from "api";
import { Form, Dialog } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import lh from "helpers/linkHandler";

const { request, flush } = entityStoreActions;

export class SettingsSubjectsEditContainer extends PureComponent {
  static displayName = "Settings.Subjects.Edit";

  static propTypes = {
    match: PropTypes.object,
    dispatch: PropTypes.func,
    subject: PropTypes.object,
    history: PropTypes.object
  };

  static mapStateToProps = state => {
    return {
      subject: select(requests.beSubject, state.entityStore)
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmation: null
    };
  }

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

  closeDialog() {
    this.setState({ confirmation: null });
  }

  handleSubjectDestroy(event, subject) {
    const heading = "Are you sure you want to delete this subject?";
    const message = "This action cannot be undone.";
    new Promise((resolve, reject) => {
      this.setState({
        confirmation: { resolve, reject, heading, message }
      });
    }).then(
      () => {
        this.destroySubject(subject);
        this.closeDialog();
      },
      () => {
        this.closeDialog();
      }
    );
  }

  destroySubject(subject) {
    const call = subjectsAPI.destroy(subject.id);
    const options = { removes: subject };
    const subjectRequest = request(call, requests.beSubjectDestroy, options);
    this.props.dispatch(subjectRequest).promise.then(() => {
      this.props.history.push(lh.link("backendSettingsSubjects"));
    });
  }

  render() {
    const subject = this.props.subject;
    if (!subject) return null;
    const attr = subject.attributes;
    return (
      <div>
        {this.state.confirmation ? (
          <Dialog.Confirm {...this.state.confirmation} />
        ) : null}
        <header className="drawer-header">
          <h2 className="heading-quaternary">{attr.name}</h2>
          <div className="buttons-bare-vertical">
            <button
              className="button-bare-primary"
              onClick={event => {
                this.handleSubjectDestroy(event, subject);
              }}
            >
              {"Delete Subject"}
              <i className="manicon manicon-trashcan" />
            </button>
          </div>
        </header>
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

export default connectAndFetch(SettingsSubjectsEditContainer);
