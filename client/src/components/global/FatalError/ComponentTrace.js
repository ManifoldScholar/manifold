import React, { PureComponent } from "react";
import PropTypes from "prop-types";

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
      <div className={"stacks"}>
        <div className={"stack"}>
          <h3>Component Stack</h3>
          <ol>
            {this.stackLines.map(line => {
              return (
                <li className={"line"} key={line.index}>
                  {line.index === 0 ? (
                    <div>
                      {"The above error occurred in the "}
                      <span className="highlight">
                        {"<"}
                        {line.component}
                        {">"}
                      </span>
                      {" component"}
                    </div>
                  ) : (
                    <div>
                      {"in "}{" "}
                      <span className="highlight">{line.component}</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    );
  }
}
