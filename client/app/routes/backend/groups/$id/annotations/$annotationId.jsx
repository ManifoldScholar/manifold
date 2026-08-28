import { useParams } from "react-router";
import { annotationsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import AnnotationDetail from "components/backend/annotation/detail";

export const handle = { drawer: true };

export const loader = async ({ params, context, url }) => {
  return loadEntity({
    context,
    fetchFn: () => annotationsAPI.show(params.annotationId),
    url
  });
};

export default function GroupAnnotationDetail({ loaderData: annotation }) {
  const { id } = useParams();

  return (
    <AnnotationDetail
      annotation={annotation}
      closeUrl={`/backend/groups/${id}/annotations`}
    />
  );
}
