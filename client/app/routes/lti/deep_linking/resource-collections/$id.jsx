import { resourceCollectionsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import loadAllPages from "lib/react-router/loaders/loadAllPages";
import DetailLayout from "components/lti/Detail";

const FILTERS = {};
const PAGE_SIZE = { size: 200 };

export const loader = async ({ params, context, url, request }) => {
  const { id } = params;
  const [collection, resources] = await Promise.all([
    loadEntity({
      context,
      fetchFn: () => resourceCollectionsAPI.show(id),
      url
    }),
    loadAllPages({
      context,
      signal: request?.signal,
      request: resourceCollectionsAPI.collectionResources(
        id,
        FILTERS,
        PAGE_SIZE
      )
    })
  ]);

  return { collection, resources: resources?.data ?? [] };
};

export default function LtiResourceCollectionDetailRoute({
  loaderData: { collection, resources }
}) {
  const categories = [{ type: "resource", collection: resources ?? [] }];

  return (
    <DetailLayout
      type="resourceCollection"
      entity={collection}
      categories={categories}
    />
  );
}
