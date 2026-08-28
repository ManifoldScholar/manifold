import { pagesAPI } from "api";
import HeadContent from "components/global/HeadContent";
import loadEntity from "lib/react-router/loaders/loadEntity";

export const loader = async ({ params, context, url }) => {
  const fetchFn = () => pagesAPI.show(params.slug);
  return loadEntity({ context, fetchFn, url });
};

export default function PageRoute({ loaderData: page }) {
  return (
    <section>
      <HeadContent title={page.attributes.title} appendDefaultTitle />
      <div
        className="container page-content"
        dangerouslySetInnerHTML={{
          __html: page.attributes.bodyFormatted
        }}
      />
    </section>
  );
}
