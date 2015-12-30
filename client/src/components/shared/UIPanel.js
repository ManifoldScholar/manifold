import React, { Component, PropTypes } from 'react';

export default class UIPanel extends Component {
  static propTypes = {
    bodyComponent: PropTypes.func
  };

  constructor() {
    super();
    this.state = {
      bodyVisible: null
    };
  }

  componentDidMount() {
    // Add logic here to show/hide menu
  }

  render = () => {
    return (
        <div>
          {/* Second argument as props */}
          {React.createElement(this.props.bodyComponent, {...this.props})}
        </div>
    );
  };
}

