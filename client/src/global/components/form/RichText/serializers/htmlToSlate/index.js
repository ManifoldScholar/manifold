import { htmlToSlate } from "./serializer";

const serializeToSlate = html => {
  const slateData = htmlToSlate(html);
  if (!slateData[0].type) {
    return [
      {
        type: "section",
        children: htmlToSlate(html)[0].children
      }
    ];
  }
  return slateData;
};

export default serializeToSlate;
