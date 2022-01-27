import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { JSONTree } from "react-json-tree";
import config from "config";

export default class Debugger extends PureComponent {
  static propTypes = {
    object: PropTypes.object,
    label: PropTypes.string,
    hideLabel: PropTypes.bool,
    theme: PropTypes.string,
    shouldExpandNode: PropTypes.func
  };

  static defaultProps = {
    label: "Debugger",
    hideLabel: false,
    theme: "dark",
    shouldExpandNode: (keyName, data, level) => level === 0
  };

  theme(type) {
    if (type === "dark") return this.darkTheme();
    return this.lightTheme();
  }

  lightTheme() {
    const theme = {
      scheme: "Mexico Light",
      author: "Sheldon Johnson",
      base00: "#f8f8f8",
      base01: "#e8e8e8",
      base02: "#d8d8d8",
      base03: "#b8b8b8",
      base04: "#585858",
      base05: "#383838",
      base06: "#282828",
      base07: "#181818",
      base08: "#ab4642",
      base09: "#dc9656",
      base0A: "#f79a0e",
      base0B: "#538947",
      base0C: "#4b8093",
      base0D: "#7cafc2",
      base0E: "#96609e",
      base0F: "#a16946"
    };
    return {
      extend: theme,
      tree: {
        padding: 20,
        margin: 0
      }
    };
  }

  darkTheme() {
    const theme = {
      scheme: "green screen",
      author: "chris kempson (http://chriskempson.com)",
      base00: "#001100",
      base01: "#003300",
      base02: "#005500",
      base03: "#007700",
      base04: "#009900",
      base05: "#00bb00",
      base06: "#00dd00",
      base07: "#00ff00",
      base08: "#007700",
      base09: "#009900",
      base0A: "#007700",
      base0B: "#00bb00",
      base0C: "#005500",
      base0D: "#009900",
      base0E: "#00bb00",
      base0F: "#005500"
    };
    return {
      extend: theme,
      tree: {
        padding: 20,
        margin: 0
      }
    };
  }

  render() {
    if (!config.environment.isDevelopment) return null;
    if (!this.props.object) return null;

    return (
      <div
        style={{
          marginBottom: 15
        }}
      >
        {this.props.hideLabel ? (
          <div
            style={{
              backgroundColor: "rgb(0, 17, 0)",
              color: "rgb(0, 153, 0)",
              margin: 0,
              padding: "10px 20px",
              display: "inline-block"
            }}
          >
            {this.props.label}
          </div>
        ) : null}
        <JSONTree
          hideRoot
          shouldExpandNode={this.props.shouldExpandNode}
          theme={this.theme(this.props.theme)}
          invertTheme={false}
          data={this.props.object}
        />
      </div>
    );
  }
}
