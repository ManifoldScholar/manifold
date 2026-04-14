import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext } from "react-router";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import Resource from "components/backend/resource";
import { resourcesAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import mergeImageAltText from "app/routes/utility/helpers/mergeImageAltText";

const formatData = (data, resourceKind) => {
  const { attributes, relationships } = data ?? {};
  const { sortOrder, ...imageAttrs } = attributes;
  const merged = mergeImageAltText(
    imageAttrs,
    "attachment",
    "variantThumbnail"
  );
  const { variantThumbnail, ...rest } = merged;

  const isImage = attributes.kind
    ? attributes.kind === "image"
    : resourceKind === "image";

  return {
    relationships,
    attributes: {
      ...rest,
      ...(!isImage ? { variantThumbnail } : {}),
      sortOrder: sortOrder ? 1 : null
    }
  };
};

export const action = formAction({
  mutation: ({ data, params }) => resourcesAPI.update(params.id, data)
});

export default function ResourceProperties() {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const resource = useOutletContext();

  const model = useMemo(
    () => ({
      ...resource,
      attributes: {
        ...resource.attributes,
        sortOrder: !!resource.attributes?.sortOrder
      }
    }),
    [resource]
  );

  return (
    <section>
      <FormContainer.Form
        model={model}
        fetcher={fetcher}
        formatData={data => formatData(data, resource.attributes.kind)}
        className="form-secondary"
        notifyOnSuccess
      >
        <Resource.Form.Fields resource={resource} />
        <Form.Save text={t("resources.properties.save")} />
      </FormContainer.Form>
    </section>
  );
}
