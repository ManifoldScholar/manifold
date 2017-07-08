import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
import lh from "helpers/linkHandler";

export default class Toc extends Component {
  static propTypes = {
    text: PropTypes.object,
    tocDrawerVisible: PropTypes.bool,
    hideTocDrawer: PropTypes.func
  };

  constructor() {
    super();
    this.counter = 0;
    this.UIHideTocDrawer = this.UIHideTocDrawer.bind(this);
    this.hasChildren = this.hasChildren.bind(this);
    this.visitNode = this.visitNode.bind(this);
  }

  UIHideTocDrawer() {
    if (this.props.tocDrawerVisible) {
      this.props.hideTocDrawer();
    }
  }

  hasChildren(array) {
    let hasChildren = false;
    array.forEach(object => {
      if (object.hasOwnProperty("children") && object.children.length > 0) {
        hasChildren = true;
      }
    });
    return hasChildren;
  }

  visitNode(node) {
    this.counter = this.counter + 1;
    let children = null;
    if (node.children && node.children.length > 0) {
      children = (
        <ul className="toc-nested-level">
          {node.children.map(this.visitNode)}
        </ul>
      );
    }

    let anchor = "";
    if (node.anchor) anchor = `#${node.anchor}`;
    return (
      <li key={this.counter}>
        <Link
          to={lh.link("readerSection", this.props.text.id, node.id, anchor)}
          onClick={this.UIHideTocDrawer}
          data-id="hide-drawer"
        >
          {node.label}
        </Link>
        {children}
      </li>
    );
  }

  render() {
    const tocClass = classNames({
      "table-of-contents": true,
      "multi-level": this.hasChildren(this.props.text.attributes.toc)
    });
    return (
      <nav className={tocClass}>
        <ul className="toc-list">
          {this.props.text.attributes.toc.map(this.visitNode)}
        </ul>
        {/* Commented out until functionality is working */}
        {/* <div className="toc-footer">
          <a href="#">
            <h4>
              <i className="manicon manicon-question-round"></i>
              About This Text
            </h4>
          </a>
        </div> */}
      </nav>
    );
  }
}
