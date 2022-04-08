import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import { actionCalloutsAPI, requests } from "api";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { entityStoreActions } from "actions";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";
import withConfirmation from "hoc/withConfirmation";

const { request } = entityStoreActions;

export class ActionCalloutForm extends Component {
  static displayName = "ActionCallout.Form";

  static propTypes = {
    calloutable: PropTypes.object.isRequired,
    closeRoute: PropTypes.string.isRequired,
    confirm: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    actionCallout: PropTypes.object.isRequired,
    refreshActionCallouts: PropTypes.func,
    t: PropTypes.func
  };

  onDelete = () => {
    const t = this.props.t;
    const heading = t("backend.forms.call-to-action.delete_modal_heading");
    const message = t("backend.forms.call-to-action.delete_modal_message");
    this.props.confirm(heading, message, () => this.onConfirmedDelete());
  };

  onConfirmedDelete = () => {
    const call = actionCalloutsAPI.destroy(this.actionCallout.id);
    const options = {
      removes: { type: "actionCallout", id: this.actionCallout.id }
    };
    const destroyRequest = request(
      call,
      requests.beActionCalloutDestroy,
      options
    );
    this.props.dispatch(destroyRequest).promise.then(() => {
      this.closeDrawer();
    });
  };

  get calloutable() {
    return this.props.calloutable;
  }

  get requestName() {
    return this.actionCallout.id
      ? requests.beActionCalloutCreate
      : requests.beActionCalloutUpdate;
  }

  get actionCallout() {
    return this.props.actionCallout;
  }

  get drawerTitle() {
    const t = this.props.t;
    if (this.actionCallout.id)
      return t("backend.forms.call-to-action.edit_drawer_title");
    return t("backend.forms.call-to-action.create_drawer_title");
  }

  get buttons() {
    return [
      {
        onClick: this.onDelete,
        label: this.props.t("actions.delete"),
        icon: "delete32",
        className: "utility-button__icon--notice"
      }
    ];
  }

  get kindOptions() {
    const t = this.props.t;
    return [
      { label: t("glossary.link_title_case_one"), value: "link" },
      { label: t("actions.read"), value: "read" },
      { label: t("glossary.table_of_contents_title_case"), value: "toc" },
      { label: t("actions.download"), value: "download" }
    ];
  }

  get visibilityOptions() {
    const t = this.props.t;
    return [
      {
        label: t("backend.forms.call-to-action.visibility_options.always"),
        value: "always"
      },
      {
        label: t("backend.forms.call-to-action.visibility_options.authorized"),
        value: "authorized"
      },
      {
        label: t(
          "backend.forms.call-to-action.visibility_options.unauthorized"
        ),
        value: "unauthorized"
      }
    ];
  }

  get textOptions() {
    const options = [
      {
        label: this.props.t(
          "backend.forms.call-to-action.text_select_placeholder"
        ),
        value: ""
      }
    ];
    if (!this.calloutable.relationships.texts) return [];
    const texts = this.calloutable.relationships.texts.map(text => {
      return { label: text.attributes.title, value: text };
    });
    return options.concat(texts);
  }

  closeDrawer = () => {
    const { closeRoute, refreshActionCallouts } = this.props;
    if (refreshActionCallouts) refreshActionCallouts();
    return this.props.history.push(lh.link(closeRoute, this.calloutable.id), {
      noScroll: true
    });
  };

  shouldShowTextsForKind(kind) {
    return kind === "read" || kind === "toc";
  }

  shouldShowVisibilityForKind(kind) {
    return kind === "link" || kind === "download";
  }

  shouldShowUrlForKind(kind) {
    return kind === "link";
  }

  shouldShowAttachmentForKind(kind) {
    return kind === "download";
  }

  create = model => {
    const adjusted = { ...model };
    const createFunc =
      this.calloutable.type === "journals"
        ? actionCalloutsAPI.createForJournal
        : actionCalloutsAPI.createForProject;
    return createFunc(this.calloutable.id, adjusted);
  };

  render() {
    const t = this.props.t;
    return (
      <>
        <Navigation.DrawerHeader
          icon="touch64"
          title={this.drawerTitle}
          buttons={this.buttons}
        />
        <FormContainer.Form
          model={this.actionCallout}
          name={this.requestName}
          update={actionCalloutsAPI.update}
          create={this.create}
          onSuccess={this.closeDrawer}
          className="form-secondary"
          notificationScope="drawer"
        >
          {getModelValue => (
            <>
              <Form.TextInput
                label={t("backend.forms.call-to-action.input_labels.title")}
                name="attributes[title]"
                focusOnMount
              />
              <Form.Select
                label={t("backend.forms.call-to-action.input_labels.type")}
                options={this.kindOptions}
                name="attributes[kind]"
              />
              {this.shouldShowVisibilityForKind(
                getModelValue("attributes[kind]")
              ) && (
                <Form.Select
                  label={t(
                    "backend.forms.call-to-action.input_labels.visibility"
                  )}
                  options={this.visibilityOptions}
                  name="attributes[visibility]"
                />
              )}
              {this.shouldShowTextsForKind(
                getModelValue("attributes[kind]")
              ) && (
                <Form.Select
                  label={t("backend.forms.call-to-action.input_labels.text")}
                  placeholder={t(
                    "backend.forms.call-to-action.text_select_placeholder"
                  )}
                  name="relationships[text]"
                  options={this.textOptions}
                  entityLabelAttribute={"title"}
                />
              )}
              {this.shouldShowUrlForKind(getModelValue("attributes[kind]")) && (
                <Form.TextInput
                  label={t("backend.forms.call-to-action.input_labels.url")}
                  name="attributes[url]"
                />
              )}
              {this.shouldShowAttachmentForKind(
                getModelValue("attributes[kind]")
              ) && (
                <Form.Upload
                  layout="portrait"
                  label={t(
                    "backend.forms.call-to-action.input_labels.download"
                  )}
                  accepts="files"
                  readFrom="attributes[attachmentStyles][original]"
                  name="attributes[attachment]"
                  remove="attributes[removeAttachment]"
                />
              )}
              <Form.Save
                text={t("backend.forms.call-to-action.input_labels.save")}
              />
            </>
          )}
        </FormContainer.Form>
      </>
    );
  }
}

export default withTranslation()(
  withConfirmation(connectAndFetch(ActionCalloutForm))
);
