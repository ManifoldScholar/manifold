import { Children, Component, PropTypes } from 'react';
import withSideEffect from 'react-side-effect';

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
  const innermostProps = propsList[propsList.length - 1];
  if (innermostProps) {
    return innermostProps.className;
  }
}

function handleStateChangeOnClient(bodyClass) {
  const exploded = document.body.className.split(' ').map((string) => { return string.trim(); });
  const bodyClasses = new Set();
  bodyClasses.add(bodyClass);
  exploded.forEach((className) => {
    bodyClasses.add(className);
  });
  document.body.className = Array.from(bodyClasses).join(' ').trim();
}

export default withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient
)(BodyClass);
