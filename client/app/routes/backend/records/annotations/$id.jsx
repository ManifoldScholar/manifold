import { annotationsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import AnnotationDetail from "components/backend/annotation/detail";

export const handle = { drawer: true };

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => annotationsAPI.show(params.id),
    request
  });
};

export default function RecordAnnotationDetail({ loaderData: annotation }) {
  return (
    <AnnotationDetail
      annotation={annotation}
      closeUrl="/backend/records/annotations"
    />
  );
}
