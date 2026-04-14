import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext } from "react-router";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import Resource from "components/backend/resource";
import { resourcesAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";

export const action = formAction({
  mutation: ({ data, params }) => resourcesAPI.update(params.id, data)
});

export default function ResourceVariants() {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const resource = useOutletContext();

  return (
    <section>
      <FormContainer.Form
        model={resource}
        fetcher={fetcher}
        className="form-secondary"
        notifyOnSuccess
      >
        <Resource.Form.Kind.Variants
          kind={resource.attributes.kind}
          resource={resource}
        />
        <Form.Save text={t("resources.properties.save")} />
      </FormContainer.Form>
    </section>
  );
}
