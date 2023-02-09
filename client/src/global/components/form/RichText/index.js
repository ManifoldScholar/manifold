import React from "react";
import Errorable from "../Errorable";
import Editor from "./Editor";
import BaseLabel from "../BaseLabel";
import Instructions from "../Instructions";

export default function RichText({ name, errors, label, instructions }) {
  return (
    <Errorable className="wide" name={name} errors={errors} label={label}>
      {label && (
        <BaseLabel as="h4" label={label} hasInstructions={!!instructions} />
      )}
      {instructions ? <Instructions instructions={instructions} /> : null}
      <Editor />
    </Errorable>
  );
}
