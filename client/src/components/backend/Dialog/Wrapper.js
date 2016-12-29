import React, { PureComponent, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router';

export default class DialogWrapper extends PureComponent {

  static displayName = "Dialog.Wrapper";

  static propTypes = {
    closeUrl: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      leaving: false
    };

    this.handleLeaveClick = this.handleLeaveClick.bind(this);
  }

  handleLeaveClick(event) {
    this.setState({
      leaving: true
    });

    setTimeout(() => {
      browserHistory.push(this.props.closeUrl);
    }, 200);
  }

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="dialog"
        // True value required to enable transform
        /* eslint-disable */
        transitionAppear={true}
        /* eslint-enable */
        transitionEnter={false}
        transitionAppearTimeout={1}
        transitionLeaveTimeout={200}
      >
        {this.state.leaving ?
          null
          :
          <div key="dialog" className="dialog-primary dialog-appear">
            <div className="dialog-overlay" onClick={this.handleLeaveClick}></div>
            <div className="dialog-box">
              <div onClick={this.handleLeaveClick} className="close-button-primary">
                <i className="manicon manicon-x"></i>
                <span className="screen-reader-text">
                  Close Dialog
                </span>
              </div>

              {this.props.children}
            </div>
          </div>
        }
      </ReactCSSTransitionGroup>
    );
  }

}
