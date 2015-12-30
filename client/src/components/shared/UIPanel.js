import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class UIPanel extends Component {
  static propTypes = {
    id: PropTypes.string,
    visibility: PropTypes.object,
    bodyComponent: PropTypes.func
  };

  render = () => {
    const visibilityClass = classNames({
      'panel-hidden': !this.props.visibility[this.props.id],
      'panel-visible': this.props.visibility[this.props.id]
    });
    return (
        <div className={visibilityClass}>
          {/* Second argument as props */}
          {React.createElement(this.props.bodyComponent, {...this.props})}
        </div>
    );
  };
}

