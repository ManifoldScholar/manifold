import { Outlet, useOutletContext } from "react-router";
import { sectionsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";

export const loader = async ({ params, context, request }) => {
  const { textId, sectionId } = params;

  return loadEntity({
    context,
    fetchFn: () => sectionsAPI.show(sectionId, textId),
    request
  });
};

export default function SectionLayout({ loaderData: section }) {
  const text = useOutletContext();

  return <Outlet context={{ text, section }} />;
}
