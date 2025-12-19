import { ApiClient, pagesAPI } from "api";
import { routerContext } from "app/contexts";
import HeadContent from "global/components/HeadContent";
import { data } from "react-router";

export const loader = async ({ params, context }) => {
  const { auth } = context.get(routerContext) ?? {};
  const client = new ApiClient(auth?.authToken, { denormalize: true });

  try {
    return await client.call(pagesAPI.show(params.slug));
  } catch (error) {
    throw data(null, { status: 404 });
  }
};

export default function PageRoute({ loaderData }) {
  const page = loaderData;

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
