import React, { useRef, useEffect } from "react";
import { ReactEditor, useFocused, useSelected } from "slate-react";
import Utility from "global/components/utility";
import HtmlLabel from "./HtmlLabel";
import { getHtmlOutlineStyles } from "./styles";
import { useFromStore, useFetch } from "hooks";
import { resourcesAPI } from "api";
import * as Styled from "./styles";

export default function ResourceBlockRenderer({
  element,
  children,
  attributes,
  theme,
  darkMode,
  showHtml
}) {
  const focused = useFocused();
  const selected = useSelected();

  const { htmlAttrs } = element ?? {};

  const resourceId = htmlAttrs.resourceid;

  const storeResource = useFromStore(
    `entityStore.entities.resources["${htmlAttrs.resourceid}"]`
  );

  console.log({ resourceId });

  const { data: apiResource } = useFetch({
    request: [resourcesAPI.show, resourceId],
    condition: !!resourceId && !storeResource
  });

  const resource = storeResource ?? apiResource;

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
  }, [theme, darkMode]);

  useEffect(() => {
    if (ref.current?.shadowRoot) {
      const shadow = ref.current.shadowRoot;
      const container = shadow.childNodes[1];
      container.innerHTML = `<div><span style="display:block;">Resource id: ${resourceId}</span><span style="display:block;">Resource url: ${resource?.attributes?.attachmentStyles.medium}</span><span>Kind: ${resource?.attributes?.kind}</span></div>`;
    }
  }, [resource, resourceId]);

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
          <span>Resource Block Placeholder</span>
        </Styled.VoidLabel>
        <div ref={ref} />
        <HtmlLabel element={element} visible={showHtml} />
      </Styled.VoidInner>
    </Styled.VoidOuter>
  );
}
