import React, { useMemo } from "react";
import { Editor } from "./components";
import setter from "../setter";
import { serializeToSlate } from "./serializers";
import { formatHtml } from "./utils/helpers";
import FieldWrapper from "../FieldWrapper";

const defaultValue = [
  {
    type: "section",
    children: [{ type: "p", children: [{ text: "" }] }]
  }
];

const getInitialSlateValue = value => {
  if (value && typeof value === "string") return serializeToSlate(value);
  return defaultValue;
};

const getInitialHtmlValue = value => {
  if (value && typeof value === "string") return formatHtml(value);
  return formatHtml("<!DOCTYPE html><section></section>");
};

function RichText({
  name,
  errors,
  set,
  stylesheets,
  sectionId,
  sectionBody,
  ...props
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
    <FieldWrapper className="wide">
      <Editor
        set={set}
        initialSlateValue={initialSlateValue}
        initialHtmlValue={initialHtmlValue}
        stylesheets={stylesheets}
        {...props}
      />
    </FieldWrapper>
  );
}

export default setter(RichText);
