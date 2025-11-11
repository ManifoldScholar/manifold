import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";
import lh from "helpers/linkHandler";
import isEmpty from "lodash/isEmpty";
import { useFromStore } from "hooks";
import { uiVisibilityActions } from "actions";
import TocNode from "./TocNode";
import * as Styled from "./styles";

export default function Toc({ text, showMeta }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const { sectionId } = useParams();
  const [mounted, setMounted] = useState(false);

  const visibility = useFromStore({ path: "ui.transitory.visibility" });
  const tocDrawerVisible = visibility?.uiPanels?.tocDrawer;

  const section = useFromStore({
    entityType: "textSections",
    action: "grab",
    id: sectionId
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!text) return null;

  const { toc, slug, metadata } = text.attributes;

  const hideTocDrawer = () => {
    if (tocDrawerVisible) {
      dispatch(uiVisibilityActions.panelHide("tocDrawer"));
      const toggleEl = document.getElementById("toc-drawer-toggle");
      if (toggleEl) toggleEl.focus();
    }
  };

  const isNodeActive = node => {
    if (!section) return false;
    if (!mounted) return false;
    const nodeId = node.id;
    const nodeHash = node.anchor ? `#${node.anchor}` : "";
    return section.id === nodeId && location.hash === nodeHash;
  };

  const visitNode = (node, depth) => {
    let children = null;
    if (node.children && node.children.length > 0) {
      children = (
        <Styled.Sublist $level={depth + 1}>
          {node.children.map(n => visitNode(n, depth + 1))}
        </Styled.Sublist>
      );
    }

    let anchor = "";
    if (node.anchor) anchor = `#${node.anchor}`;

    const active = isNodeActive(node);

    return (
      <TocNode
        key={node.label}
        node={node}
        linkTo={lh.link("readerSection", slug, node.id, anchor)}
        onClick={hideTocDrawer}
        active={active}
      >
        {children}
      </TocNode>
    );
  };

  const renderContents = () => {
    const initialDepth = 0;
    if (toc.length <= 0) {
      return (
        <>
          <Styled.Empty>
            This text does not have a table of contents.
          </Styled.Empty>
          <hr />
        </>
      );
    }
    return (
      <Styled.List>
        {toc.map(node => visitNode(node, initialDepth))}
      </Styled.List>
    );
  };

  const drawerProps = {
    open: tocDrawerVisible,
    context: "reader",
    padding: "none",
    identifier: "toc-drawer",
    entrySide: "left",
    closeCallback: hideTocDrawer,
    includeDrawerFrontMatter: false,
    ariaLabel: t("glossary.table_of_contents")
  };

  return (
    <Styled.TocDrawer {...drawerProps}>
      <Styled.Toc>
        {renderContents()}
        {!isEmpty(metadata) ? (
          <Styled.Footer>
            <Styled.FooterButton onClick={showMeta}>
              <Styled.FooterIcon icon="info16" size={32} />
              <Styled.FooterText>About This Text</Styled.FooterText>
            </Styled.FooterButton>
          </Styled.Footer>
        ) : null}
      </Styled.Toc>
    </Styled.TocDrawer>
  );
}
