import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import Resource from "backend/components/resource";
import { resourcesAPI } from "api";

function ResourceVariantsContainer() {
  const { t } = useTranslation();
  const { resource } = useOutletContext();

  return (
    <section>
      <FormContainer.Form
        model={resource}
        name="backend-resource-update"
        update={resourcesAPI.update}
        create={resourcesAPI.create}
        className="form-secondary"
      >
        <Resource.Form.Kind.Variants kind={resource.attributes.kind} />
        <Form.Save text={t("resources.properties.save")} />
      </FormContainer.Form>
    </section>
  );
}

ResourceVariantsContainer.displayName = "Resource.Variants";

export default ResourceVariantsContainer;
