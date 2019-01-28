import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
import lh from "helpers/linkHandler";

export default class TocBlockToc extends PureComponent {
  static displayName = "TocBlock.Toc";

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

  get textTitle() {
    return this.props.text.attributes.titleFormatted;
  }

  get textSubtitle() {
    return this.props.text.attributes.subtitle;
  }

  get toc() {
    return this.props.text.attributes.toc;
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
      <li key={node.id} className={`${blockClass}__node`}>
        <Link
          className={`${blockClass}__link`}
          to={lh.link(
            "readerSection",
            this.props.text.attributes.slug,
            node.id,
            anchor
          )}
        >
          {node.label}
          {/* node.creator && (
            <span className={`${blockClass}__node-creator`}>
              <span style={{ fontStyle: "italic" }}>by </span>
              {node.creator}
            </span>
          ) */}
        </Link>
        {children}
      </li>
    );
  };

  renderEmpty() {
    return (
      <React.Fragment>
        <div
          className={classNames(
            `${this.props.blockClass}__list`,
            `${this.props.blockClass}__list--empty`
          )}
        >
          This text does not have a table of contents.
        </div>
      </React.Fragment>
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
      <nav role="navigation" className={this.props.blockClass}>
        {this.props.showTextTitle && this.renderTextHeading()}
        {this.renderContents()}
      </nav>
    );
  }
}
