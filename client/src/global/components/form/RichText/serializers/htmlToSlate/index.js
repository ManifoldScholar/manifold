import { htmlToSlate } from "./serializer";

const serializeToSlate = html => {
  const slateData = htmlToSlate(html);
  const section = slateData[0];

  // Add an empty node to the end in case the last html element is a Slate void.
  return [
    {
      ...section,
      children: [
        ...section.children,
        { type: "p", slateOnly: true, children: [{ text: "" }] }
      ]
    }
  ];
};

export default serializeToSlate;
