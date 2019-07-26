import React, { PureComponent } from "react";

export default class StorybookFrontendWrapper extends PureComponent {
  render() {
    const styles = {};

    const innerStyles = {};

    return (
      <div className="frontend" style={styles}>
        <div style={innerStyles}>{this.props.children}</div>
      </div>
    );
  }
}
