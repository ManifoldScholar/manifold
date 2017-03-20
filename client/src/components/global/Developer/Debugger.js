import React, { PureComponent, PropTypes } from 'react';
import JSONTree from 'react-json-tree';

export default class Debugger extends PureComponent {

  static propTypes = {
    object: PropTypes.object,
    label: PropTypes.string
  }

  static defaultProps = {
    label: "Debugger"
  }

  theme() {
    const theme = {
      scheme: 'green screen',
      author: 'chris kempson (http://chriskempson.com)',
      base00: '#001100',
      base01: '#003300',
      base02: '#005500',
      base03: '#007700',
      base04: '#009900',
      base05: '#00bb00',
      base06: '#00dd00',
      base07: '#00ff00',
      base08: '#007700',
      base09: '#009900',
      base0A: '#007700',
      base0B: '#00bb00',
      base0C: '#005500',
      base0D: '#009900',
      base0E: '#00bb00',
      base0F: '#005500'
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
    if (!__DEVELOPMENT__) return null;
    if (!this.props.object) return null;

    return (
      <div style={{
        marginBottom: 15
      }}>
        <div style={{
          backgroundColor: "rgb(0, 17, 0)",
          color: "rgb(0, 153, 0)",
          margin: 0,
          padding: "10px 20px",
          display: "inline-block"
        }}>{this.props.label}</div>
        <JSONTree
          hideRoot
          theme={this.theme()}
          invertTheme={false}
          data={this.props.object}
        />
      </div>
    );

  }

}
