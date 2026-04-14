import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default class FatalErrorCompnentTrace extends PureComponent {
  static propTypes = {
    trace: PropTypes.string.isRequired
  };

  get stackLines() {
    let stackLines = this.props.trace.split("\n");
    stackLines.shift();
    stackLines = stackLines.map((line, index) => {
      return {
        index,
        component: (line.trim().match(/^in (\S*)/) || ["", ""])[1]
      };
    });
    return stackLines;
  }

  render() {
    return (
      <Styled.Stacks>
        <div>
          <Styled.StackTitle>Component Stack</Styled.StackTitle>
          <Styled.LineList>
            {this.stackLines.map(line => {
              return (
                <Styled.Line key={line.index}>
                  {line.index === 0 ? (
                    <div>
                      {"The above error occurred in the "}
                      <Styled.LineHighlight>
                        {"<"}
                        {line.component}
                        {">"}
                      </Styled.LineHighlight>
                      {" component"}
                    </div>
                  ) : (
                    <div>
                      {"in "}{" "}
                      <Styled.LineHighlight>
                        {line.component}
                      </Styled.LineHighlight>
                    </div>
                  )}
                </Styled.Line>
              );
            })}
          </Styled.LineList>
        </div>
      </Styled.Stacks>
    );
  }
}
