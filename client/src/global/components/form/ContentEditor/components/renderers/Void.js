import React, { useRef, useEffect } from "react";
import { ReactEditor, useFocused, useSelected } from "slate-react";
import Utility from "global/components/utility";
import HtmlLabel from "./HtmlLabel";
import { getHtmlOutlineStyles } from "./styles";
import * as Styled from "./styles";

export default function VoidRenderer({
  element,
  children,
  attributes,
  theme,
  darkMode,
  showHtml
}) {
  const focused = useFocused();
  const selected = useSelected();

  const { srcdoc } = element ?? {};

  const ref = useRef();

  useEffect(() => {
    if (ref.current && !ref.current.shadowRoot) {
      const shadow = ref.current.attachShadow({ mode: "open" });
      const container = document.createElement("div");
      const containerClass = `manifold-text-section ${
        darkMode ? "scheme-dark" : "scheme-light"
      }`;
      container.setAttribute("class", containerClass);
      const style = document.createElement("style");
      style.textContent = theme;
      shadow.appendChild(style);
      container.innerHTML = srcdoc;
      shadow.appendChild(container);
    }
    if (ref.current?.shadowRoot) {
      const shadow = ref.current.shadowRoot;
      const container = shadow.childNodes[1];
      const containerClass = `manifold-text-section ${
        darkMode ? "scheme-dark" : "scheme-light"
      }`;
      container.setAttribute("class", containerClass);
    }
  }, [srcdoc, theme, darkMode]);

  return (
    <Styled.VoidOuter {...attributes}>
      {children}
      <Styled.VoidInner
        contentEditable={false}
        $selected={selected && focused}
        style={showHtml ? getHtmlOutlineStyles("div", darkMode) : undefined}
      >
        <Styled.VoidLabel>
          <Utility.IconComposer
            svgProps={{ style: { flexShrink: 0 } }}
            icon="code24"
          />
          <span>Preview only. Switch to HTML mode to edit this block:</span>
        </Styled.VoidLabel>
        <div ref={ref} />
        <HtmlLabel element={element} visible={showHtml} />
      </Styled.VoidInner>
    </Styled.VoidOuter>
  );
}
