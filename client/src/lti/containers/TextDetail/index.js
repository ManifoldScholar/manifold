import { useParams } from "react-router";
import { textsAPI } from "api";
import { useFetch } from "hooks";
import DetailLayout from "lti/components/Detail";

export default function LtiTextDetail() {
  const { id } = useParams();

  const { data: text } = useFetch({ request: [textsAPI.show, id] });

  if (!text) return null;

  const toc = text.attributes?.toc ?? [];

  const categories = [
    {
      type: "textSection",
      collection: toc,
      textTitle: text.attributes?.titlePlaintext
    }
  ];

  return <DetailLayout type="text" entity={text} categories={categories} />;
}

LtiTextDetail.displayName = "Lti.TextDetailContainer";
