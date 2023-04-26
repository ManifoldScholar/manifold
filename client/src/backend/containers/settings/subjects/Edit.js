import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import { subjectsAPI, requests } from "api";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";
import withConfirmation from "hoc/withConfirmation";

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
    confirm: PropTypes.func.isRequired,
    t: PropTypes.func
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
    const t = this.props.t;
    const heading = t("modals.delete_subject");
    const message = t("modals.confirm_body");
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
    const { subject, t } = this.props;
    if (!subject) return null;
    const attr = subject.attributes;
    return (
      <div>
        <Layout.DrawerHeader
          title={attr.name}
          buttons={[
            {
              onClick: this.handleSubjectDestroy,
              icon: "delete32",
              label: t("actions.delete"),
              className: "utility-button__icon--notice"
            }
          ]}
        />
        <section>
          <FormContainer.Form
            model={subject}
            name="backend-edit-subject"
            update={subjectsAPI.update}
            create={subjectsAPI.create}
            className="form-secondary"
          >
            <Form.TextInput
              label={t("settings.subjects.name_label")}
              name="attributes[name]"
              placeholder={t("settings.subjects.name_label")}
            />
            <Form.Save text={t("settings.subjects.save")} />
          </FormContainer.Form>
        </section>
      </div>
    );
  }
}

export default withTranslation()(
  withConfirmation(connectAndFetch(SettingsSubjectsEditContainer))
);
