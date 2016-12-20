import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';

export default class DrawerWrapper extends PureComponent {

  static displayName = "Drawer.Wrapper"

  static propTypes = {
    closeUrl: PropTypes.string.isRequired
  }

  render() {
    return (
      <div style={{border: "4px solid red"}}>
        <div>
          <Link to={this.props.closeUrl}>Close</Link>
        </div>
        <span>I IS THE DRAWER</span>
        {this.props.children}
      </div>
    );
  }

}
