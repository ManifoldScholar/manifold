import { Component, PropTypes } from 'react';
import BodyNodes from './BodyNodes';
export default class Body extends Component {

  static propTypes = {
    section: PropTypes.object,
    annotations: PropTypes.array,
    lockedSelection: PropTypes.object
  };

  shouldComponentUpdate(nextProps, nextState) {
    const same =
      (this.props.section.attributes.bodyJson === nextProps.section.attributes.bodyJson) &&
      (this.props.annotations === nextProps.annotations) &&
      (this.props.lockedSelection === nextProps.lockedSelection);
    return !same;
  }

  render() {
    const iterator =
      new BodyNodes.Helpers.NodeTreeIterator(
        this.props.annotations, this.props.lockedSelection
      );
    const node = this.props.section.attributes.bodyJson;
    const elements = iterator.visit(node);
    return elements;
  }
}
