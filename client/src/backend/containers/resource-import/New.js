import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";

const buttonClasses = classNames(
  "buttons-icon-horizontal__button",
  "button-icon-secondary"
);

function ResourceImportNew() {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { create, update, resourceImport } = useOutletContext();

  const onSuccess = model => {
    const importId = model.id;
    const url = lh.link("backendResourceImportMap", projectId, importId);
    navigate(url);
  };

  const afterUrlChange = (value, set, setOther) => {
    if (value) {
      setOther("google_sheet", "attributes[source]");
      setOther(null, "attributes[data]");
    }
  };

  const afterSourceChange = (value, set, setOther) => {
    if (value) {
      setOther("attached_data", "attributes[source]");
      setOther(null, "attributes[url]");
    }
  };

  /* eslint-disable no-param-reassign */
  const preSave = model => {
    model.attributes.state = "parsing";
    model.attributes.storageType = "google_drive";
    return model;
  };
  /* eslint-enable no-param-reassign */

  const handleCreate = model => create(preSave(model));
  const handleUpdate = (id, model) => update(id, preSave(model));

  const headerRowOptions = () => {
    return [1, 2, 3, 4, 5, 6].map(i => {
      return { label: i.toString(), value: i };
    });
  };

  return (
    <FormContainer.Form
      model={resourceImport || null}
      name="backend-resource-import-create"
      create={handleCreate}
      update={handleUpdate}
      onSuccess={onSuccess}
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
          afterChange={afterSourceChange}
          name="attributes[data]"
          readFrom="attributes[dataFilename]"
        />
        <Form.Divider>{t("common.or")}</Form.Divider>
        <Form.TextInput
          wide
          label={t("resources.import.sheets_url")}
          afterChange={afterUrlChange}
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

ResourceImportNew.displayName = "ResourceImport.New";

export default ResourceImportNew;
