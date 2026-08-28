import { annotationsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import AnnotationDetail from "components/backend/annotation/detail";

export const handle = { drawer: true };

export const loader = async ({ params, context, url }) => {
  return loadEntity({
    context,
    fetchFn: () => annotationsAPI.show(params.id),
    url
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
