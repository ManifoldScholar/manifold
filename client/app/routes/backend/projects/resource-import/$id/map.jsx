import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { useFetcher, redirect, useParams, Link } from "react-router";
import { resourceImportsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import IconComposer from "global/components/utility/IconComposer";

const buttonClasses = classNames(
  "buttons-icon-horizontal__button",
  "button-icon-secondary"
);

export const loader = async ({ params, context, request }) => {
  const resourceImport = await loadEntity({
    context,
    fetchFn: () => resourceImportsAPI.show(params.id, params.importId),
    request
  });
  if (resourceImport.attributes.state === "pending") {
    throw redirect(
      `/backend/projects/${params.id}/resources/import/${params.importId}`
    );
  }
  return resourceImport;
};

export async function action({ request, context, params }) {
  const data = await request.json();
  data.attributes.state = "mapped";
  try {
    const result = await queryApi(
      resourceImportsAPI.update(params.id, params.importId, data),
      context
    );
    if (result?.errors) return { errors: result.errors };
    throw redirect(
      `/backend/projects/${params.id}/resources/import/${params.importId}/results`
    );
  } catch (error) {
    return handleActionError(error);
  }
}

export default function ResourceImportMap({
  loaderData: resourceImport
}) {
  const { t } = useTranslation();
  const { id, importId } = useParams();
  const fetcher = useFetcher();

  const backLinkUrl = `/backend/projects/${id}/resources/import/${importId}`;

  return (
    <div>
      <FormContainer.Form
        model={resourceImport}
        fetcher={fetcher}
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
