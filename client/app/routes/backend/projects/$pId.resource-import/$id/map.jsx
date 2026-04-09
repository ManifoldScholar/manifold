import { useEffect } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import {
  useFetcher,
  useOutletContext,
  useParams,
  useNavigate,
  Link
} from "react-router";
import { resourceImportsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import { useNotifications } from "hooks";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import IconComposer from "global/components/utility/IconComposer";

const formatData = data => ({
  ...data,
  attributes: { ...data.attributes, state: "mapped" }
});

export const action = formAction({
  mutation: ({ data, params }) =>
    resourceImportsAPI.update(params.pId, params.id, data),
  redirectTo: ({ params }) =>
    `/backend/projects/${params.pId}/resource-import/${params.id}/results`
});

export default function ResourceImportMap() {
  const { t } = useTranslation();
  const { pId, id } = useParams();
  const resourceImport = useOutletContext();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (resourceImport.attributes.state === "pending") {
      addNotification({
        level: 2,
        id: `RESOURCE_IMPORT_PENDING_${id}`,
        heading: t("resources.import.pending_heading"),
        body: t("resources.import.pending_body"),
        expiration: 10000
      });
      navigate(`/backend/projects/${pId}/resource-import/${id}`, {
        replace: true
      });
    }
  }, [resourceImport.attributes.state]); // eslint-disable-line react-hooks/exhaustive-deps

  const backLinkUrl = `/backend/projects/${pId}/resource-import/${id}`;

  const buttonClasses = classNames(
    "buttons-icon-horizontal__button",
    "button-icon-secondary"
  );

  return (
    <FormContainer.Form
      model={resourceImport}
      fetcher={fetcher}
      formatData={formatData}
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
            className={classNames(buttonClasses, "button-icon-secondary--dull")}
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
  );
}
