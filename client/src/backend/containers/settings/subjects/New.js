import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { subjectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";

export default function SettingsSubjectsNewContainer() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(lh.link("backendSettingsSubjects"));
  };

  return (
    <section>
      <Layout.DrawerHeader title={t("settings.subjects.new_header")} />
      <FormContainer.Form
        model={null}
        name="backend-create-subject"
        update={subjectsAPI.update}
        create={subjectsAPI.create}
        options={{
          adds: requests.beSubjects,
          refreshes: requests.feSubjects
        }}
        onSuccess={handleSuccess}
        className="form-secondary"
      >
        <Form.TextInput
          validation={["required"]}
          focusOnMount
          label={t("settings.subjects.name_label")}
          name="attributes[name]"
          placeholder={t("settings.subjects.name_placeholder")}
        />
        <Form.Save
          text={t("settings.subjects.new_save")}
          cancelRoute={lh.link("backendSettingsSubjects")}
        />
      </FormContainer.Form>
    </section>
  );
}

SettingsSubjectsNewContainer.displayName = "Settings.Subjects.New";
