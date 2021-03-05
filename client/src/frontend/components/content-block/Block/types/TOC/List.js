import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Node from "./Node";

export default class ContentBlockTocBlockList extends PureComponent {
  static displayName = "ContentBlock.Types.TOC.List";

  static propTypes = {
    showTextTitle: PropTypes.bool,
    showAuthors: PropTypes.bool,
    text: PropTypes.object.isRequired,
    depth: PropTypes.number,
    blockClass: PropTypes.string
  };

  static defaultProps = {
    blockClass: "toc-block"
  };

  constructor(props) {
    super(props);
    this.keyCount = 0;
  }

  get text() {
    return this.props.text;
  }

  get textTitle() {
    return this.text.attributes.titleFormatted;
  }

  get textSubtitle() {
    return this.text.attributes.subtitle;
  }

  get toc() {
    return this.text.attributes.toc;
  }

  showChildren = (node, depth) => {
    return (
      depth < this.props.depth && node.children && node.children.length > 0
    );
  };

  renderNode = (node, depth = 1) => {
    const blockClass = this.props.blockClass;

    let children = null;

    if (this.showChildren(node, depth)) {
      depth++; // eslint-disable-line no-param-reassign

      children = (
        <ul
          className={classNames(
            `${blockClass}__list`,
            `${blockClass}__list--depth-${depth}`
          )}
        >
          {/* eslint-disable-next-line no-shadow */}
          {node.children.map(node => this.renderNode(node, depth))}
        </ul>
      );
    }

    const anchor = node.anchor ? `#${node.anchor}` : "";

    return (
      <Node
        key={this.keyCount++}
        id={node.id}
        anchor={anchor}
        title={node.label}
        className={this.props.blockClass}
        textSlug={this.text.attributes.slug}
      >
        {children}
      </Node>
    );
  };

  renderEmpty() {
    return (
      <>
        <div
          className={classNames(
            `${this.props.blockClass}__list`,
            `${this.props.blockClass}__list--empty`
          )}
        >
          This text does not have a table of contents.
        </div>
      </>
    );
  }

  renderContents() {
    if (this.toc.length <= 0) return this.renderEmpty();

    return (
      <ul
        className={classNames(
          `${this.props.blockClass}__list`,
          `${this.props.blockClass}__list--depth-1`
        )}
      >
        {this.toc.map(node => this.renderNode(node, 1))}
      </ul>
    );
  }

  renderTextHeading() {
    const blockClass = this.props.blockClass;

    return (
      <h3 className={`${blockClass}__heading`}>
        <span
          className={`${blockClass}__text-title`}
          dangerouslySetInnerHTML={{
            __html: this.textTitle
          }}
        />
        {this.textSubtitle && (
          <span className={`${blockClass}__text-subtitle`}>
            {this.textSubtitle}
          </span>
        )}
      </h3>
    );
  }

  render() {
    return (
      <div className={this.props.blockClass}>
        {this.props.showTextTitle && this.renderTextHeading()}
        {this.renderContents()}
      </div>
    );
  }
}
