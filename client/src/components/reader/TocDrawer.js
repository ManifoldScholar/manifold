import React, { Component, PropTypes } from 'react';
import { Toc } from './';
import classNames from 'classnames';

export default class TocDrawer extends Component {

  static propTypes = {
    // TOC Drawer gets text, simply to pass on to the TOC component
    text: PropTypes.object,
    visible: PropTypes.bool,
    hideTocDrawer: PropTypes.func,
  };

  render = () => {
    const drawerClass = classNames({
      'toc-drawer': true,
      'drawer-hidden': !this.props.visible,
      'drawer-visible': this.props.visible
    });
    return (
        <div className={drawerClass}>
          <Toc
              text={this.props.text}
              tocDrawerVisible={this.props.visible}
              hideTocDrawer={this.props.hideTocDrawer}
          />
        </div>
    );
  };
}
