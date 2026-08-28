import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext } from "react-router";
import Form from "components/global/form";
import FormContainer from "components/global/form/Container";
import Resource from "components/backend/resource";
import { resourcesAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";

export const action = formAction({
  mutation: ({ data, params }) => resourcesAPI.update(params.id, data)
});

export default function ResourceVariants() {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const resource = useOutletContext();

  const kind = resource.attributes.kind;
  const externalVideo =
    kind === "video" ? resource.attributes.subKind === "external_video" : false;

  return (
    <section>
      <FormContainer.Form
        model={resource}
        fetcher={fetcher}
        className="form-secondary"
        notifyOnSuccess
      >
        <Resource.Form.Kind.Variants
          kind={kind}
          externalVideo={externalVideo}
          resource={resource}
        />
        <Form.Save text={t("resources.properties.save")} />
      </FormContainer.Form>
    </section>
  );
}
