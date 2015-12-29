import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router';

export default class Toc extends Component {

  static propTypes = {
    text: PropTypes.object,
    tocDrawerVisible: PropTypes.bool,
    hideTocDrawer: PropTypes.func
  };

  constructor() {
    super();
    this.counter = 0;
  }

  UIHideTocDrawer = () => {
    if (this.props.tocDrawerVisible) {
      this.props.hideTocDrawer();
    }
  };

  visitNode = (node) => {
    this.counter = this.counter + 1;
    let children = null;
    if (node.children && node.children.length > 0) {
      children = (
          <ul>
            {node.children.map(this.visitNode)}
          </ul>
      );
    }

    let anchor = '';
    if (node.anchor) anchor = `#${node.anchor}`;
    const path = `/read/${this.props.text.id}/section/${node.id}${anchor}`;

    return (
        <li key={this.counter}>
          <Link to={path} onClick={this.UIHideTocDrawer}>
            {node.label}
          </Link>
          {children}
        </li>

    );
  };

  render = () => {
    return (
        <nav className="table-of-contents">
          <ul>
            {this.props.text.attributes.toc.map(this.visitNode)}
          </ul>
        </nav>
    );
  };
}
