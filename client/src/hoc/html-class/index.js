import { Children, Component } from "react";
import PropTypes from "prop-types";
import withSideEffect from "react-side-effect";

let lastHtmlElementClassValue = null;

class HtmlClass extends Component {
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

function handleStateChangeOnClient(classes) {
  const htmlClasses = classes.map(className => className.trim());
  if (htmlClasses.join(",") === lastHtmlElementClassValue) return;
  const element = document.documentElement;
  if (!element || !element.dataset) return;
  if (element.dataset.addedClasses) {
    const previouslyAddedClasses = element.dataset.addedClasses.split(",");
    previouslyAddedClasses.forEach(className => {
      element.classList.remove(className);
    });
  }
  htmlClasses.forEach(className => {
    element.classList.add(className.trim());
  });
  lastHtmlElementClassValue = htmlClasses.join(",");
  document.documentElement.dataset.addedClasses = htmlClasses;
}

export default withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient
)(HtmlClass);
