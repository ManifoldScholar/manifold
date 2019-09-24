import React, { Component } from "react";

export default function withPropsChecker(WrappedComponent) {
  return class PropsChecker extends Component {
    componentWillReceiveProps(nextProps) {
      Object.keys(nextProps)
        .filter(key => {
          return nextProps[key] !== this.props[key];
        })
        .forEach(key => {
          /* eslint-disable no-console */
          console.log(
            "changed property:",
            key,
            "from",
            this.props[key],
            "to",
            nextProps[key]
          );
          /* eslint-enable no-console */
        });
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
