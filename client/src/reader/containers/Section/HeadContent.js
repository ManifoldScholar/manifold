import React from "react";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import HeadContent from "global/components/HeadContent";

export default function SectionHeadContent({ section, text }) {
  const headContentProps = useEntityHeadContent(section, text);

  return <HeadContent {...headContentProps} />;
}
