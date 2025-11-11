import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { subjectsAPI, requests } from "api";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { entityStoreActions } from "actions";
import { useApiCallback, useFetch } from "hooks";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";
import withConfirmation from "hoc/withConfirmation";

const { flush } = entityStoreActions;

function SettingsSubjectsEditContainer({ confirm }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: subject } = useFetch({
    request: [subjectsAPI.show, id],
    condition: !!id,
    options: { requestKey: requests.beSubject }
  });

  useEffect(() => {
    return () => {
      dispatch(flush([requests.beSubject, requests.beSubjectUpdate]));
    };
  }, [dispatch]);

  const destroySubject = useApiCallback(subjectsAPI.destroy, {
    removes: subject
  });

  const handleSubjectDestroy = () => {
    const heading = t("modals.delete_subject");
    const message = t("modals.confirm_body");
    if (confirm) {
      confirm(heading, message, async () => {
        await destroySubject(subject?.id);
        navigate(lh.link("backendSettingsSubjects"));
      });
    }
  };

  if (!subject) return null;
  const attr = subject.attributes;

  return (
    <div>
      <Layout.DrawerHeader
        title={attr.name}
        buttons={[
          {
            onClick: handleSubjectDestroy,
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

SettingsSubjectsEditContainer.displayName = "Settings.Subjects.Edit";

export default withConfirmation(SettingsSubjectsEditContainer);
