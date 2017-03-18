import { Component, PropTypes } from 'react';
import { Section } from 'components/reader';
export default class Body extends Component {

  static propTypes = {
    section: PropTypes.object,
    annotations: PropTypes.array,
    lockedSelection: PropTypes.object,
    setActiveAnnotation: PropTypes.func,
    activeAnnotation: PropTypes.string
  };

  shouldComponentUpdate(nextProps, nextState) {
    const same =
      (this.props.section.attributes.bodyJson === nextProps.section.attributes.bodyJson) &&
      (this.props.annotations === nextProps.annotations) &&
      (this.props.lockedSelection === nextProps.lockedSelection);
    return !same;
  }

  render() {
    const iterator = new Section.BodyNodes.Helpers.NodeTreeIterator(this.props);
    const node = this.props.section.attributes.bodyJson;
    const elements = iterator.visit(node);
    return elements;
  }
}
