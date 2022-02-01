import React, { useCallback } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { useMenuState } from "reakit/Menu";
import lh from "helpers/linkHandler";
import { useLocation } from "react-router-dom";
import TocNode from "./TocNode";
import * as Styled from "./styles";

export default function TableOfContents({ text, section, showMeta }) {
  const menu = useMenuState();
  const { metadata, toc, slug } = text.attributes;
  const location = useLocation();

  const renderNode = useCallback(
    (node, depth) => {
      const children = node.children?.length ? (
        <Styled.Sublist $level={depth + 1}>
          {node.children.map(n => renderNode(n, depth + 1))}
        </Styled.Sublist>
      ) : null;

      const anchor = node.anchor ? `#${node.anchor}` : "";
      const active = section?.id === node.id && location.hash === anchor;

      return (
        <TocNode
          key={node.label}
          node={node}
          linkTo={lh.link("readerSection", slug, node.id, anchor)}
          active={active}
          menu={menu}
          className={depth ? "reakit-submenu-item" : "reakit-menu-item"}
        >
          {children}
        </TocNode>
      );
    },
    [menu, location, section, slug]
  );

  const contents = toc.length ? (
    <Styled.List>{toc.map(n => renderNode(n, 0))}</Styled.List>
  ) : (
    <Styled.Empty>This text does not have a table of contents.</Styled.Empty>
  );

  return (
    <>
      <Styled.Button {...menu}>
        <span>Contents</span>
        <Styled.ButtonIconLg icon="disclosureDown24" size="default" />
        <Styled.ButtonIconSm icon="disclosureDown16" size={20} />
      </Styled.Button>
      <Styled.Toc as="nav" aria-label="Table of Contents" {...menu}>
        {contents}
        {!isEmpty(metadata) ? (
          <Styled.Footer {...menu} onClick={showMeta}>
            <Styled.FooterContent>
              <Styled.FooterIcon icon="info16" size={32} />
              <Styled.FooterText>About This Text</Styled.FooterText>
            </Styled.FooterContent>
          </Styled.Footer>
        ) : null}
      </Styled.Toc>
    </>
  );
}

TableOfContents.displayName = "Reader.TableOfContents";

TableOfContents.propTypes = {
  text: PropTypes.object,
  section: PropTypes.object,
  showMeta: PropTypes.func
};
