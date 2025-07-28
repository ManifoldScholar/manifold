import Markdown, { UnwrappedMarkdown } from "./Markdown";
import Resources from "./Resources";
import TableOfContents, { UnwrappedTOC } from "./TableOfContents";
import Texts, { UnwrappedTexts } from "./Texts";
import Metadata from "./Metadata";
import RecentActivity from "./RecentActivity";

export default {
  Markdown,
  Resources,
  TableOfContents,
  Texts,
  Metadata,
  RecentActivity
};

export const unwrappedForDefaultAttrs = {
  Markdown: UnwrappedMarkdown,
  TableOfContents: UnwrappedTOC,
  Texts: UnwrappedTexts
};
