import { useParams } from "react-router-dom";
import { useFetch } from "hooks";
import { pagesAPI } from "api";
import HeadContent from "global/components/HeadContent";

export default function PageContainer() {
  const { slug } = useParams();
  const { data: page } = useFetch({
    request: [pagesAPI.show, slug]
  });

  if (!page) return null;

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
