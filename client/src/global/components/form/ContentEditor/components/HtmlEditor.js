import React from "react";
import { config } from "ace-builds";
import Editor from "react-ace";

import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-html";

import "../../CodeArea/darkTheme";
import "../../CodeArea/lightTheme";

import cssWorkerUrl from "ace-builds/src-noconflict/worker-css";
import htmlWorkerUrl from "ace-builds/src-noconflict/worker-html";
import jsWorkerUrl from "ace-builds/src-noconflict/worker-javascript";
config.setModuleUrl("ace/mode/css_worker", cssWorkerUrl);
config.setModuleUrl("ace/mode/html_worker", htmlWorkerUrl);
config.setModuleUrl("ace/mode/javascript_worker", jsWorkerUrl);

export default function HtmlEditor(props) {
  const { aceRef, nextRef, prevRef, darkMode, ...rest } = props;
  return (
    <Editor
      ref={aceRef}
      theme={darkMode ? "idle_fingers" : "kuroir"}
      editorProps={{ $blockScrolling: true }}
      width="100%"
      minLines={40}
      maxLines={10000}
      wrapEnabled
      showPrintMargin={false}
      onLoad={editor => {
        editor.once("change", () => {
          editor.session.getUndoManager().reset();
        });
        editor.commands.removeCommand("find");
        editor.renderer.setPadding(24, 24);
        editor.renderer.setScrollMargin(24, 24);
        const input = editor.textInput.getElement();
        input.addEventListener("keydown", e => {
          if (e.key === "ArrowDown") {
            const scroller = document.querySelector(".top.pad-xl");
            scroller.scrollBy(0, 16);
          }
          if (e.key === "ArrowUp") {
            const scroller = document.querySelector(".top.pad-xl");
            scroller.scrollBy(0, -16);
          }
        });
      }}
      onFocus={() => {
        if (aceRef.current) aceRef.current.editor.gotoLine(0, 0, true);
      }}
      editorOptions={{ enableAutoIndent: true }}
      commands={[
        {
          name: "tab",
          bindKey: { win: "Tab", mac: "Tab" },
          exec: () => {
            nextRef.current.focus();
          }
        },
        {
          name: "shiftTab",
          bindKey: { win: "Shift+Tab", mac: "Shift+Tab" },
          exec: () => {
            prevRef.current.focus();
          }
        }
      ]}
      {...rest}
    />
  );
}
