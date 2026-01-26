import { useEffect } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import {
  useOutletContext,
  useParams,
  useNavigate,
  Link
} from "react-router-dom";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";

const buttonClasses = classNames(
  "buttons-icon-horizontal__button",
  "button-icon-secondary"
);

function ResourceImportMap() {
  const { t } = useTranslation();
  const { projectId, id } = useParams();
  const navigate = useNavigate();
  const { create, update, resourceImport } = useOutletContext();

  useEffect(() => {
    if (resourceImport?.attributes.state === "pending") {
      const url = lh.link(
        "backendResourceImportEdit",
        projectId,
        resourceImport.id
      );
      navigate(url);
    }
  }, [resourceImport, projectId, navigate]);

  const onSuccess = model => {
    const importId = model.id;
    const url = lh.link("backendResourceImportResults", projectId, importId);
    navigate(url);
  };

  /* eslint-disable no-param-reassign */
  const preSave = model => {
    model.attributes.state = "mapped";
    return model;
  };
  /* eslint-enable no-param-reassign */

  const handleCreate = model => create(preSave(model));
  const handleUpdate = (idIgnored, model) => update(idIgnored, preSave(model));

  const backLinkUrl = lh.link("backendResourceImportEdit", projectId, id);

  return (
    <div>
      <FormContainer.Form
        model={resourceImport}
        name="backend-resource-import-update"
        create={handleCreate}
        update={handleUpdate}
        onSuccess={onSuccess}
        className="form-secondary"
      >
        <Form.FieldGroup label={t("resources.import.step_three_header")}>
          <Form.AttributeMap
            instructions={t("forms.attribute_map.instructions")}
            name="attributes[columnMap]"
            attributes="attributes[availableColumns]"
            headers="attributes[headers]"
          />
          <div className="buttons-icon-horizontal">
            <Link
              to={backLinkUrl}
              className={classNames(
                buttonClasses,
                "button-icon-secondary--dull"
              )}
            >
              <IconComposer
                icon="close16"
                size="default"
                className="button-icon-secondary__icon"
              />
              <span>{t("actions.back")}</span>
            </Link>
            <button type="submit" className={buttonClasses}>
              <IconComposer
                icon="checkmark16"
                size="default"
                className="button-icon-secondary__icon"
              />
              <span>{t("actions.continue")}</span>
            </button>
          </div>
        </Form.FieldGroup>
      </FormContainer.Form>
    </div>
  );
}

ResourceImportMap.displayName = "ResourceImport.Map";

export default ResourceImportMap;
