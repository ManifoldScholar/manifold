import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import isObject from "lodash/isObject";
import isFunction from "lodash/isFunction";
import Developer from "global/components/developer";

export default class AnnotatableDebug extends PureComponent {
  static propTypes = {
    annotatableState: PropTypes.object,
    annotatableProps: PropTypes.object
  };

  static defaultProps() {
    return {};
  }

  get subject() {
    const newSelection = {};
    const {
      selectionState: { selection }
    } = this.props.annotatableState;
    if (selection !== null) {
      /* eslint-disable no-param-reassign */
      Object.keys(selection).reduce((map, key) => {
        const value = selection[key];
        if (key === "range") {
          map[key] = "[object Range]";
        } else if (isObject(value) && isFunction(value.toString)) {
          map[key] = value.toString();
        } else {
          map[key] = value;
        }
        return map;
      }, newSelection);
      /* eslint-enable no-param-reassign */
    }

    const out = { ...this.props.annotatableState };
    out.selectionState = {
      ...this.props.annotatableState.selectionState
    };
    out.selectionState.selection = newSelection;
    out.annotatableProps = this.props.annotatableProps;
    return out;
  }

  render() {
    return (
      <div
        className="reader-debug"
        style={{
          position: "fixed",
          top: 48,
          width: 350,
          left: 0,
          zIndex: 2000
        }}
      >
        <Developer.Debugger object={this.subject} />
      </div>
    );
  }
}
