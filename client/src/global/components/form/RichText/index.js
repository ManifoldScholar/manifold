import React, { useMemo } from "react";
import Errorable from "../Errorable";
import Editor from "./Editor";
import BaseLabel from "../BaseLabel";
import Instructions from "../Instructions";
import setter from "../setter";
import { serializeToSlate } from "./serializers";
import { formatHtml } from "./slateHelpers";

const defaultValue = [
  {
    type: "p",
    children: [{ text: "" }]
  }
];

const getInitialSlateValue = value => {
  if (value && typeof value === "string") return serializeToSlate(value);
  return defaultValue;
};

const getInitialHtmlValue = value => {
  if (value && typeof value === "string") return formatHtml(value);
  return "";
};

function RichText({
  name,
  errors,
  label,
  instructions,
  set,
  stylesheets,
  sectionId,
  sectionBody
}) {
  /* eslint-disable react-hooks/exhaustive-deps */
  const initialSlateValue = useMemo(() => {
    return getInitialSlateValue(sectionBody);
  }, [sectionId, sectionBody]);
  const initialHtmlValue = useMemo(() => getInitialHtmlValue(sectionBody), [
    sectionId,
    sectionBody
  ]);

  return (
    <Errorable className="wide" name={name} errors={errors} label={label}>
      {label && (
        <BaseLabel as="h4" label={label} hasInstructions={!!instructions} />
      )}
      {instructions ? <Instructions instructions={instructions} /> : null}
      <Editor
        set={set}
        initialSlateValue={initialSlateValue}
        initialHtmlValue={initialHtmlValue}
        stylesheets={stylesheets}
      />
    </Errorable>
  );
}

export default setter(RichText);
