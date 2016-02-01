import React, { Component, PropTypes } from 'react';

export default class Dropdown extends Component {
  static propTypes = {
    triggerComponent: PropTypes.object,
    bodyComponent: PropTypes.object
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

  clickHandler = () => {
    alert('clicked');
  }

  render() {
    return (
      <div>
        {/* Second argument as props */}
        {React.createElement(this.props.triggerComponent, { onClick: this.clickHandler })}
        {React.createElement(this.props.bodyComponent, { ...this.props })}
      </div>
    );
  }
}
