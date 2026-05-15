import { resourceCollectionsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import loadList from "lib/react-router/loaders/loadList";
import DetailLayout from "components/lti/Detail";

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
    resources: resources.data
  };
};

export default function LtiResourceCollectionDetail({
  loaderData: { collection, resources }
}) {
  const categories = [{ type: "resource", collection: resources }];

  return (
    <DetailLayout
      type="resourceCollection"
      entity={collection}
      categories={categories}
    />
  );
}
