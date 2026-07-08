import { useParams } from "react-router";
import { resourceCollectionsAPI } from "api";
import { useFetch } from "hooks";
import DetailLayout from "lti/components/Detail";

const FILTERS = {};
const PAGE_SIZE = { size: 200 };

export default function LtiResourceCollectionDetail() {
  const { id } = useParams();

  const { data: collection } = useFetch({
    request: [resourceCollectionsAPI.show, id]
  });
  const { data: resources } = useFetch({
    request: [
      resourceCollectionsAPI.collectionResources,
      id,
      FILTERS,
      PAGE_SIZE,
      true
    ]
  });

  if (!collection) return null;

  const categories = [{ type: "resource", collection: resources ?? [] }];

  return (
    <DetailLayout
      type="resourceCollection"
      entity={collection}
      categories={categories}
    />
  );
}

LtiResourceCollectionDetail.displayName =
  "Lti.ResourceCollectionDetailContainer";
