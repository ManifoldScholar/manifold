import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useFetch } from "hooks";
import { pagesAPI, requests } from "api";
import { entityStoreActions } from "actions";
import HeadContent from "global/components/HeadContent";

const { flush } = entityStoreActions;

export default function PageContainer() {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { data: page } = useFetch({
    request: [pagesAPI.show, slug],
    options: { requestKey: requests.gPage }
  });

  useEffect(() => {
    return () => {
      dispatch(flush(requests.gPage));
    };
  }, [dispatch]);

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
