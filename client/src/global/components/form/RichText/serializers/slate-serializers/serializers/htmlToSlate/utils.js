import { jsx } from "slate-hyperscript";

export const addSlateOnlySpan = node => {
  return jsx("element", { type: "span", slateOnly: true }, [node]);
};

export const hasChildTypeMismatch = children => {
  const hasElementChild = children.find(c => c.type);
  const hasTextChild = children.find(c => c.text);
  return hasElementChild && hasTextChild;
};

export const handleChildMismatch = children => {
  if (!hasChildTypeMismatch(children)) return children;

  return children.map(c => (c.text ? addSlateOnlySpan(c) : c));
};
