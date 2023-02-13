import { htmlToSlate } from "./serializer";

const serializeToSlate = html => {
  const slateData = htmlToSlate(html);
  return slateData;
};

export default serializeToSlate;
