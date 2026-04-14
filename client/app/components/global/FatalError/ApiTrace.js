import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

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
      <Styled.Stacks>
        {Object.keys(trace).map(stackName => {
          return (
            <div key={stackName}>
              <Styled.StackTitle>API {stackName}</Styled.StackTitle>
              <Styled.LineList>
                {Object.values(trace[stackName]).map(line => {
                  return <Styled.Line key={line.id}>{line.trace}</Styled.Line>;
                })}
              </Styled.LineList>
            </div>
          );
        })}
      </Styled.Stacks>
    );
  }
}
