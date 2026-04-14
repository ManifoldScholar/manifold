import { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { actionCalloutsAPI } from "api";
import { useApiCallback } from "hooks";
import FormContainer from "components/global/form/Container";
import Form from "components/global/form";
import Layout from "components/backend/layout";
import useConfirmation from "hooks/useConfirmation";
import Dialog from "components/global/dialog";

function ActionCalloutForm({ calloutable, closeUrl, fetcher, actionCallout }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { confirm, confirmation } = useConfirmation();

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

  const deleteActionCallout = useApiCallback(actionCalloutsAPI.destroy);

  const onConfirmedDelete = useCallback(
    async closeDialog => {
      if (!actionCallout?.id) return;
      try {
        await deleteActionCallout(actionCallout.id);
        navigate(closeUrl);
      } catch {
        closeDialog();
      }
    },
    [actionCallout?.id, deleteActionCallout, navigate, closeUrl]
  );

  const onDelete = useCallback(() => {
    confirm({
      heading: t("modals.delete_cta"),
      message: t("modals.confirm_body"),
      callback: onConfirmedDelete
    });
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

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <Layout.DrawerHeader
        icon="touch64"
        title={drawerTitle}
        buttons={buttons}
      />
      <FormContainer.Form
        model={actionCallout}
        fetcher={fetcher}
        className="form-secondary"
        debug
      >
        {getModelValue => {
          return (
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
              {shouldShowVisibilityForKind(
                getModelValue("attributes[kind]")
              ) && (
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
              {shouldShowAttachmentForKind(
                getModelValue("attributes[kind]")
              ) && (
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
          );
        }}
      </FormContainer.Form>
    </>
  );
}

ActionCalloutForm.displayName = "ActionCallout.Form";

ActionCalloutForm.propTypes = {
  calloutable: PropTypes.object.isRequired,
  closeUrl: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  actionCallout: PropTypes.object.isRequired
};

export default ActionCalloutForm;
