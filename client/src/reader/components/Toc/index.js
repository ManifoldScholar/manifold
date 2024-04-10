import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { withRouter } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import TocNode from "./TocNode";
import * as Styled from "./styles";

class Toc extends PureComponent {
  static propTypes = {
    text: PropTypes.object,
    section: PropTypes.object,
    tocDrawerVisible: PropTypes.bool,
    hideTocDrawer: PropTypes.func,
    showMeta: PropTypes.func,
    history: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  /* eslint-disable react/no-did-mount-set-state */
  componentDidMount() {
    this.setState({ mounted: true });
  }
  /* eslint-enable react/no-did-mount-set-state */

  get text() {
    return this.props.text;
  }

  get attributes() {
    return this.text.attributes;
  }

  get metadata() {
    return this.attributes.metadata;
  }

  get toc() {
    return this.attributes.toc;
  }

  get slug() {
    return this.attributes.slug;
  }

  get section() {
    return this.props.section;
  }

  UIHideTocDrawer = () => {
    if (this.props.tocDrawerVisible) {
      this.props.hideTocDrawer();

      const toggleEl = document.getElementById("toc-drawer-toggle");
      if (toggleEl) toggleEl.focus();
    }
  };

  hasChildren = array => {
    let hasChildren = false;
    array.forEach(object => {
      if (object.hasOwnProperty("children") && object.children.length > 0) {
        hasChildren = true;
      }
    });
    return hasChildren;
  };

  visitNode = (node, depth) => {
    let children = null;
    if (node.children && node.children.length > 0) {
      children = (
        <Styled.Sublist $level={depth + 1}>
          {node.children.map(n => this.visitNode(n, depth + 1))}
        </Styled.Sublist>
      );
    }

    let anchor = "";
    if (node.anchor) anchor = `#${node.anchor}`;

    const active = this.isNodeActive(node);

    return (
      <TocNode
        key={node.label}
        node={node}
        linkTo={lh.link("readerSection", this.slug, node.id, anchor)}
        onClick={this.UIHideTocDrawer}
        active={active}
      >
        {children}
      </TocNode>
    );
  };

  isNodeActive(node) {
    if (!this.section) return false;
    if (!this.state.mounted) return false;
    const { location } = this.props.history;
    const nodeId = node.id;
    const nodeHash = node.anchor ? `#${node.anchor}` : "";
    return this.section.id === nodeId && location.hash === nodeHash;
  }

  showMeta = () => {
    this.props.showMeta();
  };

  renderContents() {
    const initialDepth = 0;
    if (this.toc.length <= 0) return this.renderEmpty();
    return (
      <Styled.List>
        {this.toc.map(node => this.visitNode(node, initialDepth))}
      </Styled.List>
    );
  }

  renderEmpty() {
    return (
      <>
        <Styled.Empty>
          This text does not have a table of contents.
        </Styled.Empty>
        <hr />
      </>
    );
  }

  render() {
    const drawerProps = {
      open: this.props.tocDrawerVisible,
      context: "reader",
      padding: "none",
      identifier: "toc-drawer",
      entrySide: "left",
      closeCallback: this.UIHideTocDrawer,
      includeDrawerFrontMatter: false,
      ariaLabel: this.props.t("glossary.table_of_contents")
    };

    return (
      <Styled.TocDrawer {...drawerProps}>
        <Styled.Toc>
          {this.renderContents()}
          {!isEmpty(this.metadata) ? (
            <Styled.Footer>
              <Styled.FooterButton onClick={this.showMeta}>
                <Styled.FooterIcon icon="info16" size={32} />
                <Styled.FooterText>About This Text</Styled.FooterText>
              </Styled.FooterButton>
            </Styled.Footer>
          ) : null}
        </Styled.Toc>
      </Styled.TocDrawer>
    );
  }
}

export default withTranslation()(withRouter(Toc));
