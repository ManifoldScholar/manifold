import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
import lh from "helpers/linkHandler";
import { withRouter } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import Drawer from "global/components/drawer";
import IconComposer from "global/components/utility/IconComposer";

class Toc extends PureComponent {
  static propTypes = {
    text: PropTypes.object,
    section: PropTypes.object,
    tocDrawerVisible: PropTypes.bool,
    hideTocDrawer: PropTypes.func,
    showMeta: PropTypes.func,
    history: PropTypes.object
  };

  constructor() {
    super();
    this.counter = 0;
    this.state = {
      mounted: false
    };
  }

  /* eslint-disable react/no-did-mount-set-state */
  componentDidMount() {
    this.setState({ mounted: true });
  }
  /* eslint-enable react/no-did-mount-set-state */

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

  visitNode = node => {
    this.counter += 1;
    let children = null;
    if (node.children && node.children.length > 0) {
      children = (
        <ol className="toc-nested-level">
          {node.children.map(this.visitNode)}
        </ol>
      );
    }

    let anchor = "";
    if (node.anchor) anchor = `#${node.anchor}`;

    const active = this.isNodeActive(node);

    return (
      <li key={this.counter}>
        <Link
          to={lh.link(
            "readerSection",
            this.props.text.attributes.slug,
            node.id,
            anchor
          )}
          onClick={this.UIHideTocDrawer}
          data-id="hide-drawer"
          className={active ? "active" : null}
        >
          {node.label}
        </Link>
        {children}
      </li>
    );
  };

  isNodeActive(node) {
    if (!this.props.section) return false;
    if (!this.state.mounted) return false;
    const { location } = this.props.history;
    const nodeId = node.id;
    const nodeHash = node.anchor ? `#${node.anchor}` : "";
    return this.props.section.id === nodeId && location.hash === nodeHash;
  }

  showMeta = () => {
    this.props.showMeta();
  };

  renderContents(text) {
    if (text.attributes.toc.length <= 0) return this.renderEmpty();
    return (
      <ol className="toc-list">{text.attributes.toc.map(this.visitNode)}</ol>
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
    const text = this.props.text;
    const metadata = text.attributes.metadata;

    const tocClass = classNames({
      "table-of-contents": true,
      "multi-level": this.hasChildren(text.attributes.toc)
    });

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
        <nav className={tocClass} aria-label="Table of Contents">
          {this.renderContents(text)}
          {!isEmpty(metadata) ? (
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
