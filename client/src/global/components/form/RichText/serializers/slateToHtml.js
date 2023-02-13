import { slateToHtml } from "slate-serializers";

const serializeToHtml = node => slateToHtml(node);

export default serializeToHtml;
