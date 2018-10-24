import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class FatalErrorApiTrace extends PureComponent {
  static propTypes = {
    trace: PropTypes.object.isRequired
  };

  get trace() {
    return this.props.trace;
  }

  render() {
    const trace = this.trace;
    return (
      <div className={"stacks"}>
        {Object.keys(trace).map(stackName => {
          return (
            <div className={"stack"} key={stackName}>
              <h3>API {stackName}</h3>
              <ol>
                {Object.values(trace[stackName]).map(line => {
                  return (
                    <li className={"line"} key={line.id}>
                      {line.trace}
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>
    );
  }
}
