import React from "react";
import Editor from "react-ace";
import "brace/mode/css";
import "brace/mode/javascript";
import "brace/mode/html";
import "../../CodeArea/darkTheme";
import "../../CodeArea/lightTheme";

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
