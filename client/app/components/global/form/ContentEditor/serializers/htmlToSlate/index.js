import { htmlToSlate } from "./serializer";
import { removeFormatting } from "./removeFormatting";

const serializeToSlate = html => {
  const slateData = htmlToSlate(html);
  return slateData;
};

export default serializeToSlate;
export { removeFormatting };
