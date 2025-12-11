import classNames from "classnames";
import { useTranslation } from "react-i18next";
import FormContainer from "components/global/form/Container";
import Form from "components/global/form";
import IconComposer from "components/global/utility/IconComposer";

const buttonClasses = classNames(
  "buttons-icon-horizontal__button",
  "button-icon-secondary"
);

const headerRowOptions = () => {
  return [1, 2, 3, 4, 5, 6].map(i => {
    return { label: i.toString(), value: i };
  });
};

function formatData(dirty, source) {
  const attributes = { ...source.attributes, ...dirty.attributes };
  attributes.state = "parsing";
  attributes.storageType = "google_drive";
  if (attributes.data) {
    attributes.source = "attached_data";
    delete attributes.url;
  } else if (attributes.url) {
    attributes.source = "google_sheet";
    delete attributes.data;
  }
  return { attributes };
}

export default function ImportForm({ resourceImport, fetcher }) {
  const { t } = useTranslation();

  return (
    <FormContainer.Form
      model={resourceImport || null}
      fetcher={fetcher}
      formatData={formatData}
      groupErrors
      className="form-secondary"
    >
      {resourceImport && resourceImport.attributes.parseError ? (
        <Form.InputError
          errors={[
            {
              detail: t("resources.import.parse_error")
            }
          ]}
        />
      ) : null}
      <Form.FieldGroup label={t("resources.import.step_one_header")}>
        <Form.Upload
          wide
          label={t("resources.import.upload_instructions")}
          accepts="csv"
          layout="horizontal"
          name="attributes[data]"
          readFrom="attributes[dataFilename]"
        />
        <Form.Divider>{t("common.or")}</Form.Divider>
        <Form.TextInput
          wide
          label={t("resources.import.sheets_url")}
          instructions={t("resources.import.sheets_instructions")}
          name="attributes[url]"
        />
      </Form.FieldGroup>
      <Form.FieldGroup label={t("resources.import.step_two_header")}>
        <Form.Select
          label={t("resources.import.headers_label")}
          options={headerRowOptions()}
          name="attributes[headerRow]"
          instructions={t("resources.import.headers_instructions")}
        />
        <Form.TextInput
          label={t("resources.import.storage_identifier_label")}
          name="attributes[storageIdentifier]"
          instructions={t("resources.import.storage_identifier_instructions")}
        />
      </Form.FieldGroup>
      <div className="buttons-icon-horizontal right">
        <button type="submit" className={buttonClasses}>
          <IconComposer
            icon="checkmark16"
            size="default"
            className="button-icon-secondary__icon"
          />
          <span>{t("actions.continue")}</span>
        </button>
      </div>
    </FormContainer.Form>
  );
}
