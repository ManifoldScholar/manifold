import { useTranslation } from "react-i18next";
import { resourceCollectionsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import loadList from "lib/react-router/loaders/loadList";
import LtiRow from "components/lti/Row";
import BrowseList from "components/lti/BrowseList";
import EntityHeader from "components/lti/EntityHeader";
import { useSelection } from "contexts";

export const handle = {
  breadcrumb: ({ loaderData, params }, location) => {
    const title = loaderData?.collection?.attributes?.title;
    const trail = location?.state?.trail ?? [];
    return [
      ...trail,
      title
        ? { label: title, to: `/lti/resource-collections/${params.id}` }
        : null
    ].filter(Boolean);
  }
};

export const loader = async ({ params, request, context }) => {
  const collection = await loadEntity({
    context,
    fetchFn: () => resourceCollectionsAPI.show(params.id),
    request
  });

  const resources = await loadList({
    request,
    context,
    fetchFn: (filters, pagination) =>
      resourceCollectionsAPI.collectionResources(
        params.id,
        filters,
        pagination
      ),
    options: { defaultPagination: { page: 1, perPage: 50 } }
  });

  return {
    collection,
    resources: resources.data,
    resourcesMeta: resources.meta
  };
};

export default function LtiResourceCollectionDetail({
  loaderData: { collection, resources, resourcesMeta }
}) {
  const { t } = useTranslation();
  const { titlePlaintext, title, subtitle } = collection.attributes;
  const headerTitle = titlePlaintext ?? title;
  const { add, remove, has } = useSelection();

  return (
    <>
      <EntityHeader
        id={collection.id}
        type="resourceCollection"
        title={headerTitle}
        subtitle={subtitle}
      />
      <h2>{t("lti.lists.resources_heading")}</h2>
      <BrowseList meta={resourcesMeta}>
        {resources.map(resource => {
          const { titlePlaintext: rTitle } = resource.attributes;
          const item = {
            type: "resource",
            id: resource.id,
            title: rTitle
          };
          const selected = has(item);
          return (
            <LtiRow
              key={resource.id}
              entity={resource}
              kind="resource"
              selected={selected}
              onToggle={() => (selected ? remove(item) : add(item))}
            />
          );
        })}
      </BrowseList>
    </>
  );
}
