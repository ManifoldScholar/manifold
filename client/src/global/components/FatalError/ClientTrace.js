import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class FatalErrorClientTrace extends PureComponent {
  static adjustedStackLines(stackLines) {
    return stackLines.map((line, index) => {
      let adjustedLine = line.replace("at ", "");
      adjustedLine = adjustedLine.replace(" (", "%%%");
      adjustedLine = adjustedLine.replace(")", "");
      const parts = adjustedLine.split("%%%");
      return {
        id: index,
        method: parts[0].trim(),
        location: parts[1].replace("webpack-internal:///", ""),
        orig: line
      };
    });
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
    console.error(this.props.trace);
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
      <div className={"stacks"}>
        <div className={"stack"}>
          <h3>{this.props.truncate ? "Truncated" : null} Client Stack</h3>
          <ol>
            {this.state.stackLines.map(line => {
              return (
                <li className={"line"} key={line.id}>
                  {line.method}
                  <span className="location">{line.location}</span>
                </li>
              );
            })}
          </ol>
          {this.state.hidden > 0 ? (
            <span className="footnote">
              {`${this.state.hidden} ${
                this.state.hidden > 1 ? "lines" : "line"
              } hidden.`}
              {" Consult console for full stack trace."}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
}
