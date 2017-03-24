import React, { Component } from "react";
import PropTypes from "prop-types";
import { Toc } from "components/reader";
import Utility from "components/global/Utility";
import classNames from "classnames";

export default class TocDrawer extends Component {
  static propTypes = {
    // TOC Drawer gets text, simply to pass on to the TOC component
    text: PropTypes.object,
    section: PropTypes.object,
    visible: PropTypes.bool,
    hideTocDrawer: PropTypes.func
  };

  render() {
    const drawerClass = classNames({
      "toc-drawer": true,
      "drawer-hidden": !this.props.visible,
      "drawer-visible": this.props.visible
    });
    if (!this.props.text || !this.props.section) return null;
    return (
      <Utility.EdgeLockScroll>
        {/* NB: This ref is not currently accessible by the parent element */}
        <div className={drawerClass}>
          <Toc
            text={this.props.text}
            section={this.props.section}
            tocDrawerVisible={this.props.visible}
            hideTocDrawer={this.props.hideTocDrawer}
          />
        </div>
      </Utility.EdgeLockScroll>
    );
  }
}
