import { useTranslation } from "react-i18next";
import { camelCase } from "lodash-es";
import Form from "components/global/form";
import FormContainer from "components/global/form/Container";

export default function ExportTargetForm({ fetcher, model }) {
  const { t } = useTranslation();

  return (
    <FormContainer.Form
      model={model}
      className="form-secondary"
      notificationScope="drawer"
      fetcher={fetcher}
    >
      {getModelValue => {
        const strategy = camelCase(getModelValue("attributes[strategy]"));
        return (
          <>
            <Form.Errors names={["attributes[configuration]"]} />
            <Form.TextInput
              focusOnMount
              label={t("settings.export_targets.name_label")}
              name="attributes[name]"
              placeholder={t("settings.export_targets.name_placeholder")}
              wide
            />
            <Form.TextInput
              label={t("settings.export_targets.format_label")}
              name="attributes[configuration][targetNameFormat]"
              placeholder="%s.%e"
              wide
            />
            <Form.Select
              label={t("settings.export_targets.type_label")}
              name="attributes[strategy]"
              options={[
                {
                  label: t("settings.export_targets.type_options.sftp_key"),
                  value: "sftp_key"
                },
                {
                  label: t(
                    "settings.export_targets.type_options.sftp_password"
                  ),
                  value: "sftp_password"
                }
              ]}
            />
            <Form.TextInput
              label={t("settings.export_targets.host_label")}
              name={`attributes[configuration][${strategy}][host]`}
              placeholder={t("settings.export_targets.host_placeholder")}
              wide
            />
            <Form.TextInput
              label={t("settings.export_targets.port_label")}
              name={`attributes[configuration][${strategy}][port]`}
              placeholder="22"
              wide
            />
            <Form.TextInput
              label={t("settings.export_targets.username_label")}
              name={`attributes[configuration][${strategy}][username]`}
              placeholder={t("settings.export_targets.username_placeholder")}
              show_uncategorized_texts
              wide
            />
            {strategy === "sftpKey" && (
              <Form.TextArea
                label={t("settings.export_targets.private_key_label")}
                name={`attributes[configuration][${strategy}][privateKey]`}
                wide
              />
            )}
            {strategy === "sftpPassword" && (
              <Form.TextInput
                password
                label={t("settings.export_targets.password_label")}
                name={`attributes[configuration][${strategy}][password]`}
                wide
              />
            )}
            <Form.Save text={t("settings.export_targets.submit_label")} />
          </>
        );
      }}
    </FormContainer.Form>
  );
}
