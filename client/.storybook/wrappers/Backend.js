import React, { PureComponent } from "react";

export default class StorybookBackendWrapper extends PureComponent {

  render() {

    const styles = {
      padding: 25
    };

    const innerStyles = {
      border: "1px solid #424242",
      borderStyle: "dashed"
    };

    return (
      <div className="backend bg-neutral90" style={styles}>
        <div style={innerStyles}>
          {this.props.children}
        </div>
      </div>
    )
  }

};
