import { useParams } from "react-router";
import { annotationsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import AnnotationDetail from "backend/components/annotation/detail";

export const handle = { drawer: true };

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => annotationsAPI.show(params.annotationId),
    request
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
