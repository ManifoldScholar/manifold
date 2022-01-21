import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default class FatalErrorClientTrace extends PureComponent {
  static adjustedStackLines(stackLines) {
    return stackLines
      .map((line, index) => {
        let adjustedLine = line.replace("at ", "");
        adjustedLine = adjustedLine.replace(" (", "%%%");
        adjustedLine = adjustedLine.replace(")", "");
        const parts = adjustedLine.split("%%%");
        if (parts.length === 1) return null;
        return {
          id: index,
          method: parts[0].trim(),
          location: parts[1].replace("webpack-internal:///", ""),
          orig: line
        };
      })
      .filter(i => !!i);
  }

  static propTypes = {
    trace: PropTypes.string.isRequired,
    truncate: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = { stackLines: [], count: 0, hidden: 0 };
  }

  componentDidMount() {
    console.error(this.props.trace); // eslint-disable-line no-console
  }

  static getDerivedStateFromProps(props) {
    let stackLines = props.trace.split("\n");
    stackLines.shift();
    const count = stackLines.length;
    let hidden = 0;
    if (props.truncate) {
      stackLines = stackLines.slice(0, props.truncate);
      hidden = count - props.truncate;
    }
    stackLines = FatalErrorClientTrace.adjustedStackLines(stackLines);
    return { stackLines, count, hidden };
  }

  render() {
    if (!this.state.stackLines) return null;

    return (
      <Styled.Stacks>
        <>
          <Styled.StackTitle>
            {this.props.truncate ? "Truncated" : null} Client Stack
          </Styled.StackTitle>
          <Styled.LineList>
            {this.state.stackLines.map(line => {
              return (
                <Styled.Line key={line.id}>
                  {line.method}
                  <Styled.LineLocation>{line.location}</Styled.LineLocation>
                </Styled.Line>
              );
            })}
          </Styled.LineList>
          {this.state.hidden > 0 ? (
            <Styled.Footnote>
              {`${this.state.hidden} ${
                this.state.hidden > 1 ? "lines" : "line"
              } hidden.`}
              {" Consult console for full stack trace."}
            </Styled.Footnote>
          ) : null}
        </>
      </Styled.Stacks>
    );
  }
}
