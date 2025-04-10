import Editor from "react-ace";
import { config } from "ace-builds";
import Errorable from "../Errorable";
import BaseLabel from "../BaseLabel";
import Instructions from "../Instructions";

import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-html";

import "./darkTheme";
import "./lightTheme";

import cssWorkerUrl from "ace-builds/src-noconflict/worker-css";
import htmlWorkerUrl from "ace-builds/src-noconflict/worker-html";
import jsWorkerUrl from "ace-builds/src-noconflict/worker-javascript";
config.setModuleUrl("ace/mode/css_worker", cssWorkerUrl);
config.setModuleUrl("ace/mode/html_worker", htmlWorkerUrl);
config.setModuleUrl("ace/mode/javascript_worker", jsWorkerUrl);

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
