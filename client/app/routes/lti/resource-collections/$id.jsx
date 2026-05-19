import { resourceCollectionsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import loadAllPages from "lib/react-router/loaders/loadAllPages";
import DetailLayout from "components/lti/Detail";

export const loader = async ({ params, request, context }) => {
  const collection = await loadEntity({
    context,
    fetchFn: () => resourceCollectionsAPI.show(params.id),
    request
  });

  const resources = await loadAllPages({
    context,
    request: resourceCollectionsAPI.collectionResources(params.id)
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
