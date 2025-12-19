import { pagesAPI } from "api";
import HeadContent from "global/components/HeadContent";
import loadEntity from "app/routes/utility/loaders/loadEntity";

export const loader = async ({ params, context }) => {
  const fetchFn = () => pagesAPI.show(params.slug);
  return loadEntity({ context, fetchFn });
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
