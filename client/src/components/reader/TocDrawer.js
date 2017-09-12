import React, { Component } from "react";
import PropTypes from "prop-types";
import { Toc } from "components/reader";
import Utility from "components/global/Utility";
import classNames from "classnames";

export default class TocDrawer extends Component {
  static propTypes = {
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
    return (
      <Utility.EdgeLockScroll>
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
