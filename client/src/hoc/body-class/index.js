import { Children, Component } from "react";
import PropTypes from "prop-types";
import withSideEffect from "react-side-effect";

class BodyClass extends Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    children: PropTypes.object
  };

  render() {
    if (this.props.children) {
      return Children.only(this.props.children);
    }
    return null;
  }
}

function reducePropsToState(propsList) {
  const classes = propsList.map(prop => {
    return prop.className;
  });
  return classes;
}

function handleStateChangeOnClient(bodyClasses) {
  document.body.className = bodyClasses.join(" ").trim();
}

export default withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient
)(BodyClass);
