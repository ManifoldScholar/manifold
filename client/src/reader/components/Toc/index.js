import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { withRouter } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import Drawer from "global/components/drawer";
import IconComposer from "global/components/utility/IconComposer";
import TocNode from "./TocNode";

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
        <ol
          className={`table-of-contents__list table-of-contents__list--depth-${depth +
            1}`}
        >
          {node.children.map(n => this.visitNode(n, depth + 1))}
        </ol>
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
      <ol
        className={`table-of-contents__list table-of-contents__list--depth-0`}
      >
        {this.toc.map(node => this.visitNode(node, initialDepth))}
      </ol>
    );
  }

  renderEmpty() {
    return (
      <>
        <div className="toc-empty">
          This text does not have a table of contents.
        </div>
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
      returnFocusOnDeactivate: false,
      includeSRCloseButton: true
    };

    return (
      <Drawer.Wrapper {...drawerProps}>
        <nav className="table-of-contents" aria-label="Table of Contents">
          {this.renderContents()}
          {!isEmpty(this.metadata) ? (
            <div className="toc-footer">
              <button onClick={this.showMeta} className="toc-footer__button">
                <IconComposer
                  icon="info16"
                  size={32}
                  iconClass="toc-footer__icon"
                />
                <h4 className="toc-footer__text">About This Text</h4>
              </button>
            </div>
          ) : null}
        </nav>
      </Drawer.Wrapper>
    );
  }
}

export default withRouter(Toc);
