import React, { Component, PropTypes } from 'react';
import { Toc } from 'components/reader';
import Utility from 'components/global/Utility';
import classNames from 'classnames';

export default class TocDrawer extends Component {

  static propTypes = {
    // TOC Drawer gets text, simply to pass on to the TOC component
    text: PropTypes.object,
    visible: PropTypes.bool,
    hideTocDrawer: PropTypes.func,
  };

  render() {
    const drawerClass = classNames({
      'toc-drawer': true,
      'drawer-hidden': !this.props.visible,
      'drawer-visible': this.props.visible
    });
    return (
      <Utility.ScrollLock>
        {/* NB: This ref is not currently accessible by the parent element */}
        <div className={drawerClass}>
          <Toc
            text={this.props.text}
            tocDrawerVisible={this.props.visible}
            hideTocDrawer={this.props.hideTocDrawer}
          />
        </div>
      </Utility.ScrollLock>
    );
  }
}
