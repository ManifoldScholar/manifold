import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

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
    array.forEach((object) => {
      if (object.hasOwnProperty('children') && object.children.length > 0) {
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

    let anchor = null;
    if (node.anchor) anchor = `#${node.anchor}`;
    const path = `/read/${this.props.text.id}/section/${node.id}${anchor || ""}`;

    return (
      <li key={this.counter}>
        <Link to={path} onClick={this.UIHideTocDrawer}>
          {node.label}
        </Link>
        {children}
      </li>
    );
  }

  render() {
    const tocClass = classNames({
      'table-of-contents': true,
      'multi-level': this.hasChildren(this.props.text.attributes.toc)
    });
    return (
      <nav className={tocClass}>
        <ul className="toc-list">
          {this.props.text.attributes.toc.map(this.visitNode)}
        </ul>
        <div className="toc-footer">
          <a href="#">
            <h4>
              <i className="manicon manicon-question-round"></i>
              About This Text
            </h4>
          </a>
        </div>
      </nav>
    );
  }
}
