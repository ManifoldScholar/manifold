import { useTranslation } from "react-i18next";
import LtiRow from "components/lti/Row";
import { useSelection } from "contexts";

const TYPE_LABEL_KEYS = {
  project: "lti.types.project",
  text: "lti.types.text",
  textSection: "lti.types.section",
  resource: "lti.types.resource"
};

const ROW_TYPES = Object.keys(TYPE_LABEL_KEYS);

export default function SearchResultRow({ result }) {
  const { t } = useTranslation();
  const { add, remove, has } = useSelection();
  const type = result.attributes?.searchableType;
  const entity = result.relationships?.model;
  if (!entity || !ROW_TYPES.includes(type)) {
    return null;
  }

  const resultAttrs = result.attributes ?? {};
  const parentText = resultAttrs.parents?.text;
  const parentProject = resultAttrs.parents?.project;

  let to = null;
  let parent = null;
  const baseTitle =
    entity.attributes?.titlePlaintext ??
    resultAttrs.title ??
    entity.attributes?.name;
  let title = baseTitle;
  let selectionTitle = baseTitle;

  if (type === "project") {
    to = `/lti/projects/${entity.id}`;
  } else if (type === "text") {
    to = `/lti/texts/${entity.id}`;
  } else if (type === "textSection") {
    title = resultAttrs.title ?? entity.attributes?.name ?? baseTitle;
    const parentSlug = parentText?.slug;
    if (parentSlug) {
      to = `/lti/texts/${parentSlug}`;
      parent = { label: parentText.title, to };
    }
    selectionTitle = parentText?.title
      ? `${parentText.title} — ${title}`
      : title;
  } else if (type === "resource") {
    to = `/lti/resources/${entity.id}`;
    if (parentProject?.id) {
      parent = {
        label: parentProject.title,
        to: `/lti/projects/${parentProject.id}`
      };
    }
  }

  const selectionType = type === "textSection" ? "section" : type;
  const item = { type: selectionType, id: entity.id, title: selectionTitle };
  const selected = has(item);

  return (
    <LtiRow
      entity={entity}
      kind={type}
      to={to}
      parent={parent}
      title={title}
      typeLabel={t(TYPE_LABEL_KEYS[type])}
      selected={selected}
      onToggle={() => (selected ? remove(item) : add(item))}
    />
  );
}
