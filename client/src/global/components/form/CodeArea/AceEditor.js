import React from "react";
import Editor from "react-ace";
import Errorable from "../Errorable";
import BaseLabel from "../BaseLabel";
import Instructions from "../Instructions";

import "brace/mode/css";
import "brace/mode/javascript";
import "brace/mode/html";
import "./darkTheme";
import "./lightTheme";

/* eslint-disable react/prop-types */
export default function AceEditor(props) {
  return (
    <Errorable
      className="wide"
      name={props.name}
      errors={props.errors}
      label={props.label}
    >
      {props.label && (
        <BaseLabel
          as="h4"
          label={props.label}
          hasInstructions={!!props.instructions}
        />
      )}
      {props.instructions ? (
        <Instructions instructions={props.instructions} />
      ) : null}
      <Editor {...props} />
    </Errorable>
  );
}
