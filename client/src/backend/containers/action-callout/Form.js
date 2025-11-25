import { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { actionCalloutsAPI, requests } from "api";
import { useApiCallback } from "hooks";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";
import withConfirmation from "hoc/withConfirmation";

function ActionCalloutForm({
  calloutable,
  closeRoute,
  confirm,
  actionCallout,
  refreshActionCallouts
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const requestName = actionCallout?.id
    ? requests.beActionCalloutUpdate
    : requests.beActionCalloutCreate;

  const drawerTitle = actionCallout?.id
    ? t("call_to_action.edit_drawer_title")
    : t("call_to_action.create_drawer_title");

  const kindOptions = useMemo(() => {
    if (calloutable?.type === "journals") {
      return [
        { label: t("glossary.link_title_case_one"), value: "link" },
        { label: t("actions.download"), value: "download" }
      ];
    }
    return [
      { label: t("glossary.link_title_case_one"), value: "link" },
      { label: t("actions.read"), value: "read" },
      { label: t("glossary.table_of_contents_title_case"), value: "toc" },
      { label: t("actions.download"), value: "download" }
    ];
  }, [calloutable?.type, t]);

  const visibilityOptions = useMemo(
    () => [
      {
        label: t("layout.visibility_options.always"),
        value: "always"
      },
      {
        label: t("layout.visibility_options.authorized"),
        value: "authorized"
      },
      {
        label: t("layout.visibility_options.unauthorized"),
        value: "unauthorized"
      }
    ],
    [t]
  );

  const textOptions = useMemo(() => {
    const options = [
      {
        label: t("call_to_action.text_select_placeholder"),
        value: ""
      }
    ];
    if (!calloutable?.relationships?.texts) return options;
    const texts = calloutable.relationships.texts.map(text => {
      return { label: text.attributes.title, value: text };
    });
    return options.concat(texts);
  }, [calloutable?.relationships?.texts, t]);

  const deleteActionCallout = useApiCallback(actionCalloutsAPI.destroy, {
    requestKey: requests.beActionCalloutDestroy,
    removes: { type: "actionCallout", id: actionCallout?.id }
  });

  const closeDrawer = useCallback(() => {
    if (refreshActionCallouts) refreshActionCallouts();
    navigate(lh.link(closeRoute, calloutable?.id), {
      state: { noScroll: true }
    });
  }, [refreshActionCallouts, navigate, closeRoute, calloutable?.id]);

  const onConfirmedDelete = useCallback(async () => {
    if (!actionCallout?.id) return;
    await deleteActionCallout(actionCallout.id);
    closeDrawer();
  }, [actionCallout?.id, deleteActionCallout, closeDrawer]);

  const onDelete = useCallback(() => {
    const heading = t("modals.delete_cta");
    const message = t("modals.confirm_body");
    confirm(heading, message, onConfirmedDelete);
  }, [confirm, t, onConfirmedDelete]);

  const buttons = useMemo(() => {
    if (!actionCallout?.id) return [];
    return [
      {
        onClick: onDelete,
        label: t("actions.delete"),
        icon: "delete32",
        className: "utility-button__icon--notice"
      }
    ];
  }, [actionCallout?.id, onDelete, t]);

  const shouldShowTextsForKind = kind => {
    return kind === "read" || kind === "toc";
  };

  const shouldShowVisibilityForKind = kind => {
    return kind === "link" || kind === "download";
  };

  const shouldShowUrlForKind = kind => {
    return kind === "link";
  };

  const shouldShowAttachmentForKind = kind => {
    return kind === "download";
  };

  const create = useCallback(
    model => {
      const adjusted = { ...model };
      const createFunc =
        calloutable?.type === "journals"
          ? actionCalloutsAPI.createForJournal
          : actionCalloutsAPI.createForProject;
      return createFunc(calloutable.id, adjusted);
    },
    [calloutable]
  );

  if (!actionCallout || !calloutable) return null;

  return (
    <>
      <Layout.DrawerHeader
        icon="touch64"
        title={drawerTitle}
        buttons={buttons}
      />
      <FormContainer.Form
        model={actionCallout}
        name={requestName}
        update={actionCalloutsAPI.update}
        create={create}
        onSuccess={closeDrawer}
        className="form-secondary"
        notificationScope="drawer"
      >
        {getModelValue => (
          <>
            <Form.TextInput
              label={t("call_to_action.input_labels.title")}
              name="attributes[title]"
              focusOnMount
            />
            <Form.Select
              label={t("call_to_action.input_labels.type")}
              options={kindOptions}
              name="attributes[kind]"
            />
            {shouldShowVisibilityForKind(getModelValue("attributes[kind]")) && (
              <Form.Select
                label={t("call_to_action.input_labels.visibility")}
                options={visibilityOptions}
                name="attributes[visibility]"
              />
            )}
            {shouldShowTextsForKind(getModelValue("attributes[kind]")) && (
              <Form.Select
                label={t("call_to_action.input_labels.text")}
                placeholder={t("call_to_action.text_select_placeholder")}
                name="relationships[text]"
                options={textOptions}
                entityLabelAttribute="title"
              />
            )}
            {shouldShowUrlForKind(getModelValue("attributes[kind]")) && (
              <Form.TextInput
                label={t("call_to_action.input_labels.url")}
                name="attributes[url]"
              />
            )}
            {shouldShowAttachmentForKind(getModelValue("attributes[kind]")) && (
              <Form.Upload
                layout="portrait"
                label={t("call_to_action.input_labels.download")}
                accepts="files"
                readFrom="attributes[attachmentStyles][original]"
                name="attributes[attachment]"
                remove="attributes[removeAttachment]"
              />
            )}
            <Form.Save text={t("call_to_action.input_labels.save")} />
          </>
        )}
      </FormContainer.Form>
    </>
  );
}

ActionCalloutForm.displayName = "ActionCallout.Form";

ActionCalloutForm.propTypes = {
  calloutable: PropTypes.object.isRequired,
  closeRoute: PropTypes.string.isRequired,
  confirm: PropTypes.func.isRequired,
  actionCallout: PropTypes.object.isRequired,
  refreshActionCallouts: PropTypes.func
};

export default withConfirmation(ActionCalloutForm);
