import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
import lh from "helpers/linkHandler";
import { withRouter } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import { Overlay } from "components/global";
import { TextMeta } from "components/reader";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";

class Toc extends PureComponent {
  static propTypes = {
    text: PropTypes.object,
    section: PropTypes.object,
    tocDrawerVisible: PropTypes.bool,
    hideTocDrawer: PropTypes.func,
    history: PropTypes.object
  };

  constructor() {
    super();
    this.counter = 0;
    this.UIHideTocDrawer = this.UIHideTocDrawer.bind(this);
    this.hasChildren = this.hasChildren.bind(this);
    this.visitNode = this.visitNode.bind(this);

    this.state = {
      mounted: false,
      metaVisible: false
    };
  }

  /* eslint-disable react/no-did-mount-set-state */
  componentDidMount() {
    this.setState({ mounted: true });
  }
  /* eslint-enable react/no-did-mount-set-state */

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
  }

  isNodeActive(node) {
    if (!this.props.section) return false;
    if (!this.state.mounted) return false;
    const { location } = this.props.history;
    const nodeId = node.id;
    const nodeHash = node.anchor ? `#${node.anchor}` : "";
    return this.props.section.id === nodeId && location.hash === nodeHash;
  }

  showMeta = () => {
    this.setState({
      metaVisible: true
    });
  };

  hideMeta = () => {
    this.setState({
      metaVisible: false
    });
  };

  render() {
    const text = this.props.text;
    const metadata = text.attributes.metadata;

    const tocClass = classNames({
      "table-of-contents": true,
      "multi-level": this.hasChildren(text.attributes.toc)
    });

    return (
      <nav className={tocClass}>
        <ul className="toc-list">
          {text.attributes.toc.map(this.visitNode)}
        </ul>
        {!isEmpty(metadata)
          ? <div className="toc-footer">
              <button onClick={this.showMeta}>
                <h4>
                  <i className="manicon manicon-i-round" />
                  About This Text
                </h4>
              </button>
            </div>
          : null}
        <ReactCSSTransitionGroup
          transitionName="overlay-full"
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}
        >
          {this.state.metaVisible
            ? <Overlay closeCallback={this.hideMeta} appearance="overlay-full">
                <TextMeta
                  title={text.attributes.title}
                  subtitle={text.attributes.subtitle}
                  meta={text.attributes.metadata}
                />
              </Overlay>
            : null}
        </ReactCSSTransitionGroup>
      </nav>
    );
  }
}

export default withRouter(Toc);
