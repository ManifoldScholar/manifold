import React from "react";
import Errorable from "../Errorable";
import Editor from "./Editor";
import BaseLabel from "../BaseLabel";
import Instructions from "../Instructions";
import setter from "../setter";

function RichText({ name, errors, label, instructions, set, value }) {
  return (
    <Errorable className="wide" name={name} errors={errors} label={label}>
      {label && (
        <BaseLabel as="h4" label={label} hasInstructions={!!instructions} />
      )}
      {instructions ? <Instructions instructions={instructions} /> : null}
      <Editor set={set} value={value} />
    </Errorable>
  );
}

export default setter(RichText);
