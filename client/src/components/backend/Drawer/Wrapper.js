import React, { PureComponent, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router';

export default class DrawerWrapper extends PureComponent {

  static displayName = "Drawer.Wrapper"

  static propTypes = {
    closeUrl: PropTypes.string.isRequired,
    title: PropTypes.string
  }

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="drawer"
        transitionAppear={true}
        transitionAppearTimeout={3000}
        transitionEnter={false}
        transitionLeave={true}
        transitionLeaveTimeout={3000}
      >
        <div key="drawer" className="drawer-primary">
          <div className="rel">
            <Link to={this.props.closeUrl} className="drawer-close">
              <i className="manicon manicon-x"></i>
              <span className="screen-reader-text">
                Close Drawer
              </span>
            </Link>
            <h2 className="title">
              {this.props.title}
            </h2>
            <div className="utility">

            </div>
            {this.props.children}
          </div>
        </div>
      </ReactCSSTransitionGroup>
    );
  }

}
